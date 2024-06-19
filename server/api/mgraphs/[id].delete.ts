import { mongooseErrorHandler } from '~/server/utils/mongooseErrorHandler';
import { monographs } from '~/server/models';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const id = getRouterParam(event, 'id');

    try {
      await monographs.findByIdAndDelete(id);
      return { message: 'Монография была успешно удалена!' };
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
