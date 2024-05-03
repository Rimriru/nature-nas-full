import mongoose from 'mongoose';
import { links, routes } from '../../models/index';
import { NOT_FOUND_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE } from '~/utils/errorMessages';
import type { NewLinkRequestBody } from './types/links';
import type { Link } from '~/types/LinkDataFromDb';

export default defineEventHandler(async (evt) => {
  const { title, to, groupId } = await readBody<NewLinkRequestBody>(evt);
  const session = await mongoose.startSession();
  const jwt = getCookie(evt, 'jwt');

  try {
    if (jwt) {
      const result = session.withTransaction(async () => {
        const route = await routes.findOne({ path: to });
        if (!route) {
          throw createError({
            status: 404,
            message: NOT_FOUND_ERROR_MESSAGE
          });
        }

        const newLink = await links.create({
          title,
          to,
          route
        });
        const newLinkTyped = newLink as unknown as Link;

        let updatedGroup;
        if (groupId) {
          updatedGroup = await $fetch(`/api/groups/links/${groupId}`, {
            method: 'put',
            body: {
              linkId: newLinkTyped._id
            }
          });
        }

        setResponseStatus(evt, 201);
        return { updatedGroup, newLinkTyped };
      });

      return result;
    } else {
      throw createError({
        status: 401,
        message: UNAUTHORIZED_ERROR_MESSAGE
      });
    }
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  } finally {
    session.endSession();
  }
});
