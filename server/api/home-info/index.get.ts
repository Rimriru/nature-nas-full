import { homeInfo } from '~/server/models';
import type HomeInfo from '~/types/HomeInfoDataFromDb';

export default defineEventHandler(async (event) => {
  try {
    const info = await homeInfo.findOne();
    return info as unknown as HomeInfo;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
