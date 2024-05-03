import { contents } from '../../models/index';
import { UNAUTHORIZED_ERROR_MESSAGE } from '~/utils/errorMessages';

export default defineEventHandler(async (evt) => {
  const id = getRouterParam(evt, 'id');
  const contentBody = await readBody(evt);
  const jwt = getCookie(evt, 'jwt');

  try {
    if (jwt) {
      const editedContent = await contents.findByIdAndUpdate(id, contentBody, { new: true });
      return editedContent;
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
