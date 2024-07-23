import { news } from '~/server/models';
import type { NewsDataFromDb } from '~/types/NewsDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);

    try {
      const editedNewsItem = await news.findByIdAndUpdate(id, body, { new: true });
      return editedNewsItem as unknown as NewsDataFromDb;
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
