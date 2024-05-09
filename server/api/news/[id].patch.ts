import { news } from '~/server/models';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);

    try {
      const editedNewsItem = await news.findByIdAndUpdate(id, body, { new: true });
      return editedNewsItem;
    } catch (error: any) {
      return createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
