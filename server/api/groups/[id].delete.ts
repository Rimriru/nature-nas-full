import mongoose from 'mongoose';
import { links, groups } from '../../models/index';
import { UNAUTHORIZED_ERROR_MESSAGE } from '~/utils/errorMessages';
import type { LinkGroup } from '~/types/LinkDataFromDb';

export default defineEventHandler(async (event) => {
  const groupId = getRouterParam(event, 'id');
  const jwt = getCookie(event, 'jwt');
  const session = await mongoose.startSession();
  try {
    if (jwt) {
      const result: Promise<{ message: string }> = session.withTransaction(async () => {
        const deletedGroup = await groups.findByIdAndDelete(groupId);
        const deletedGroupTyped = deletedGroup as unknown as LinkGroup;
        await links.deleteMany({
          _id: { $in: deletedGroupTyped.links }
        });
        return { message: 'Группа ссылок удалена' };
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
