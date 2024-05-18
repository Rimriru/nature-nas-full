import { journal } from '~/server/models';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);

    try {
      const editedJournal = await journal
        .findByIdAndUpdate(id, body, { new: true })
        .populate(['authorRules', 'editorialPolicy']);
      return editedJournal;
    } catch (error: any) {
      return createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
