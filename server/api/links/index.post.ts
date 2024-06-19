import mongoose from 'mongoose';
import { links, routes } from '../../models/index';
import { NOT_FOUND_ERROR_MESSAGE, BAD_REQUEST_ERROR_MESSAGE } from '~/utils/errorMessages';
import type { NewLinkRequestBody } from './types/links';
import type { Link } from '~/types/LinkDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (evt) => {
    const { title, to, groupId, type } = await readBody<NewLinkRequestBody>(evt);
    const session = await mongoose.startSession();

    if (!title || !to || !groupId) {
      throw createError({
        status: 400,
        message: BAD_REQUEST_ERROR_MESSAGE
      });
    }

    try {
      const result = session.withTransaction(async () => {
        let route;
        if (!type || type !== 'param') {
          route = await routes.findOne({ path: to });
          if (!route) {
            throw createError({
              status: 404,
              message: NOT_FOUND_ERROR_MESSAGE
            });
          }
        }

        const newLink = await links.create({
          title,
          to,
          route
        });
        const newLinkTyped = newLink as unknown as Link;

        const updatedGroup = await $fetch(`/api/groups/links/${groupId}`, {
          method: 'put',
          body: {
            linkId: newLinkTyped._id
          }
        });

        setResponseStatus(evt, 201);
        return { updatedGroup, newLinkTyped };
      });

      return result;
    } catch (error: any) {
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    } finally {
      session.endSession();
    }
  }
});
