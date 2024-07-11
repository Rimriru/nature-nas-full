import { contents } from '~/server/models/index';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (evt) => {
    const id = getRouterParam(evt, 'id');
    const contentBody = await readBody(evt);

    try {
      const editedContent = await contents.findByIdAndUpdate(id, contentBody, { new: true });
      return editedContent;
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
