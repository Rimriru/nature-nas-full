import { homeInfo } from '~/server/models';
import type HomeInfo from '~/types/HomeInfoDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    try {
      const editedInfo = await homeInfo.findByIdAndUpdate(id, body, { new: true });
      return editedInfo as unknown as HomeInfo;
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
