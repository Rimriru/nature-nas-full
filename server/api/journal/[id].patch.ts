import { journal } from '~/server/models';
import type { JournalDataFromDb } from '~/types/JournalDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);

    try {
      const editedJournal = await journal
        .findByIdAndUpdate(id, body, { new: true })
        .populate(['authorRules', 'editorialPolicy']);
      return editedJournal as unknown as JournalDataFromDb;
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
