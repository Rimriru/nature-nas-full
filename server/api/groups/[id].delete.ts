import mongoose from 'mongoose';
import { links, groups } from '~/server/models/index';
import type { LinkGroup } from '~/types/LinkDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const groupId = getRouterParam(event, 'id');
    const session = await mongoose.startSession();
    try {
      const result: Promise<{ message: string }> = session.withTransaction(async () => {
        const deletedGroup = await groups.findByIdAndDelete(groupId);
        const deletedGroupTyped = deletedGroup as unknown as LinkGroup;
        await links.deleteMany({
          _id: { $in: deletedGroupTyped.links }
        });
        return { message: 'Группа ссылок удалена' };
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
