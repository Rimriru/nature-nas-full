import multer from 'multer';
import { contents } from '../../models/index';
import { CONFLICT_ROUTE_ERROR_MESSAGE } from '~/utils/errorMessages';
import type { newRouteContentRequestBody } from './types/content';

export default defineEventHandler(async (evt) => {
  const newContent = await readBody<newRouteContentRequestBody>(evt);
  try {
    const newContentData = await contents.create(newContent);
    setResponseStatus(evt, 201);
    return newContentData;
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
