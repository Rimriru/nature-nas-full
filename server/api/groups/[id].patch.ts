import { groups } from '~/server/models/index';
import type { LinkGroup } from '~/types/LinkDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const id = getRouterParam(event, 'id');
    const groupData = await readBody(event);

    try {
      const editedGroup: LinkGroup | null = await groups.findByIdAndUpdate(id, groupData, {
        new: true
      });
      return editedGroup;
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
