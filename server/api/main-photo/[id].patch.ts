import { mainPhoto } from '~/server/models';
import { UNAUTHORIZED_ERROR_MESSAGE } from '~/utils/errorMessages';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  const jwt = getCookie(event, 'jwt');

  try {
    if (jwt) {
      const updatedPhoto = await mainPhoto.findByIdAndUpdate(id, body, { new: true });
      return updatedPhoto;
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
