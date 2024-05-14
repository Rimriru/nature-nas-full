import { journal, files } from '~/server/models';

export default defineEventHandler(async (event) => {
  const _ = [journal.length, files.length];
  try {
    const natureJournal = await journal.findOne().populate(['authorRules', 'editorialPolicy']);
    return natureJournal;
  } catch (error: any) {
    return createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
