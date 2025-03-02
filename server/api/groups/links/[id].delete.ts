import { groups } from '~/server/models/index';
import { BAD_REQUEST_ERROR_MESSAGE } from '~/utils/errorMessages';
import type { LinkGroup } from '~/types/LinkDataFromDb';

export default defineEventHandler({
  handler: async (event) => {
    const groupId = getRouterParam(event, 'id');
    const { linkId } = getQuery(event);

    if (!groupId || !linkId) {
      throw createError({
        status: 400,
        message: BAD_REQUEST_ERROR_MESSAGE
      });
    }

    try {
      const editedLinkGroup = await groups
        .findByIdAndUpdate(groupId, { $pull: { links: linkId } }, { new: true })
        .populate('links');
      return editedLinkGroup as unknown as LinkGroup;
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
