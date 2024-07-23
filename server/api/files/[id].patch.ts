import { files } from '~/server/models';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  try {
    const editedFile = await files.findByIdAndUpdate(id, body, { new: true });
    return editedFile;
  } catch (error: any) {
    mongooseErrorHandler(error);
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
