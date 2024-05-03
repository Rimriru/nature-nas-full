import { sections } from '../../models/index';
import { UNAUTHORIZED_ERROR_MESSAGE } from '~/utils/errorMessages';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const jwt = getCookie(event, 'jwt');

  try {
    if (jwt) {
      await sections.findByIdAndDelete(id);
      return { message: 'Раздел удалён' };
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
  }
});
