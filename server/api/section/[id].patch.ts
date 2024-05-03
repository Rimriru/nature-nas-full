import { sections } from '../../models/index';
import { BAD_REQUEST_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE } from '~/utils/errorMessages';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const sectionBody = await readBody(event);
  const jwt = getCookie(event, 'jwt');

  if (!id || !sectionBody) {
    throw createError({
      status: 400,
      message: BAD_REQUEST_ERROR_MESSAGE
    });
  }

  try {
    if (jwt) {
      const updatedSection = await sections.findByIdAndUpdate(id, sectionBody, { new: true });
      const message = `Раздел "${sectionBody.title}" был изменён`;
      return { message, updatedSection };
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
