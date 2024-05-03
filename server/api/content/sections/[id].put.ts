import { contents } from '../../../models/index';
import { BAD_REQUEST_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE } from '~/utils/errorMessages';

export default defineEventHandler(async (event) => {
  const contentId = getRouterParam(event, 'id');
  const { sectionId } = await readBody(event);
  const jwt = getCookie(event, 'jwt');

  if (!contentId || !sectionId) {
    throw createError({
      status: 400,
      message: BAD_REQUEST_ERROR_MESSAGE
    });
  }

  try {
    if (jwt) {
      const newContent = await contents.findByIdAndUpdate(
        contentId,
        { $addToSet: { sections: sectionId } },
        { new: true }
      );
      return newContent;
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
