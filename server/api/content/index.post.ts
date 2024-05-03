import { contents } from '../../models/index';
import { CONFLICT_ROUTE_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE } from '~/utils/errorMessages';
import type { newRouteContentRequestBody } from './types/content';

export default defineEventHandler(async (evt) => {
  const newContent = await readBody<newRouteContentRequestBody>(evt);
  const jwt = getCookie(evt, 'jwt');

  try {
    if (jwt) {
      const newContentData = await contents.create(newContent);
      setResponseStatus(evt, 201);
      return newContentData;
    } else {
      throw createError({
        status: 401,
        message: UNAUTHORIZED_ERROR_MESSAGE
      });
    }
  } catch (error: any) {
    if (error.code === 11000) {
      throw createError({
        statusCode: 409,
        message: CONFLICT_ROUTE_ERROR_MESSAGE
      });
    } else {
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
