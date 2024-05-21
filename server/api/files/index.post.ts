import { files } from '~/server/models';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const newFile = await files.create(body);
    return newFile;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
