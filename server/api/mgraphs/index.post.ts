import { monographs } from '~/server/models';
import { mongooseErrorHandler } from '~/server/utils/mongooseErrorHandler';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const body = await readBody(event);

    try {
      const newMonograph: any = await monographs.create(body);
      return newMonograph;
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
