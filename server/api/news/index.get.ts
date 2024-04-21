import { news } from '~/server/models';

export default defineEventHandler(async (event) => {
  try {
    return await news.find({});
  } catch (error: any) {
    return createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
