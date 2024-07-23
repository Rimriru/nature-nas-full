import { sections } from '~/server/models/index';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const id = getRouterParam(event, 'id');

    try {
      await sections.findByIdAndDelete(id);
      return { message: 'Раздел удалён' };
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
