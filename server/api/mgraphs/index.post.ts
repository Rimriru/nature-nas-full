import { monographs } from '~/server/models';
import type { IMonographFromDb } from '~/types/MgraphsDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const body = await readBody(event);

    try {
      const newMonograph: any = await monographs.create(body);
      return newMonograph as unknown as IMonographFromDb;
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
