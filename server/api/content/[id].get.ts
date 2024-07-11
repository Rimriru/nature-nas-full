import { contents, sections } from '~/server/models/index';
import type { ContentFromDb } from '~/types/ContentDataFromDb';

export default defineEventHandler(async (evt) => {
  const id = getRouterParam(evt, 'id');
  const _ = [contents.length, sections.length];
  try {
    const content = await contents.findOne({ route: id }).populate('sections');
    return content as unknown as ContentFromDb;
  } catch (error: any) {
    mongooseErrorHandler(error);
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
