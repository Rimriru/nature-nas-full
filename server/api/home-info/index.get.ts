import { homeInfo } from '~/server/models';

export default defineEventHandler(async (event) => {
  try {
    const info = await homeInfo.findOne();
    return info;
  } catch (error: any) {
    return createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
