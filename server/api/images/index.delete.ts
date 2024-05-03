import { promises as fs } from 'fs';
import { UNAUTHORIZED_ERROR_MESSAGE } from '~/utils/errorMessages';

export default defineEventHandler(async (event) => {
  const body = await readBody<[]>(event);
  const jwt = getCookie(event, 'jwt');

  try {
    if (jwt) {
      if (body.length) {
        body.forEach(async (image: string) => {
          await fs.unlink(`public/assets/images/${image}`);
        });
      }
      return { message: 'Images are removed' };
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
