import { news } from '~/server/models';
import type { NewsDataFromDb } from '~/types/NewsDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const body = await readBody(event);

    try {
      const createdNewsItem = await news.create(body);
      setResponseStatus(event, 201);
      return createdNewsItem as unknown as NewsDataFromDb;
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
