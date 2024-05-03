import { slides } from '~/server/models';
import { UNAUTHORIZED_ERROR_MESSAGE } from '~/utils/errorMessages';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  const jwt = getCookie(event, 'jwt');

  try {
    if (jwt) {
      const editedSlide = await slides.findByIdAndUpdate(id, body, { new: true });
      return editedSlide;
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
