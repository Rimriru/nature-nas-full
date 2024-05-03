import mongoose from 'mongoose';
import { links } from '../../models/index';
import { UNAUTHORIZED_ERROR_MESSAGE } from '~/utils/errorMessages';

export default defineEventHandler(async (evt) => {
  const linkId = getRouterParam(evt, 'id');
  const { groupId } = getQuery(evt);
  const session = await mongoose.startSession();
  const jwt = getCookie(evt, 'jwt');

  try {
    if (jwt) {
      const result = session.withTransaction(async () => {
        await links.findByIdAndDelete(linkId);
        await $fetch(`/api/groups/links/${groupId}`, {
          method: 'delete',
          query: {
            linkId
          }
        });

        return { message: 'Ссылка  удалена' };
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
