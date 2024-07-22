import mongoose from 'mongoose';
import { links } from '../../models/index';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (evt) => {
    const linkId = getRouterParam(evt, 'id');
    const { groupId } = getQuery(evt);
    const session = await mongoose.startSession();

    try {
      const result = session.withTransaction(async () => {
        await links.findByIdAndDelete(linkId);
        await $fetch(`/api/groups/links/${groupId}`, {
          method: 'delete',
          query: {
            linkId
          }
        });

        return { message: 'Ссылка удалена' };
      });

      return result;
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    } finally {
      session.endSession();
    }
  }
});
