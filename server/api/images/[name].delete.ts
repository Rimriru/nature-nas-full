import { promises as fs } from 'fs';
import { UNAUTHORIZED_ERROR_MESSAGE } from '~/utils/errorMessages';

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name');
  const jwt = getCookie(event, 'jwt');

  try {
    if (jwt) {
      await fs.unlink(`public/assets/images/${name}`);
    } else {
      throw createError({
        status: 401,
        message: UNAUTHORIZED_ERROR_MESSAGE
      });
    }
  } catch (error: any) {
    return createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
