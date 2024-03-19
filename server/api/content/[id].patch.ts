import { contents } from '../../models/index';
import type { Content } from '~/types/ContentDataFromDb';

export default defineEventHandler(async (evt) => {
  const id = getRouterParam(evt, 'id');
  const contentBody = await readBody(evt);

  try {
    const editedContent = await contents.findByIdAndUpdate(id, contentBody, { new: true });
    return editedContent;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
