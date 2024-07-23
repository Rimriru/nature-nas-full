import { groups } from '~/server/models/index';
import type { LinkGroup } from '~/types/LinkDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (evt) => {
    const newGroupData = await readBody(evt);

    try {
      const newGroup = await groups.create(newGroupData);
      setResponseStatus(evt, 201);
      return newGroup as unknown as LinkGroup;
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
