import { journal, files } from '~/server/models';
import type { JournalDataFromDb } from '~/types/JournalDataFromDb';

export default defineEventHandler(async (event) => {
  const _ = [journal.length, files.length];
  try {
    const natureJournal = await journal.findOne().populate(['authorRules', 'editorialPolicy']);
    return natureJournal as unknown as JournalDataFromDb;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
