import { files } from '~/server/models';
import type { FileDataFromDb } from '~/types/FilesDataFromDb';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const newFile = await files.create(body);
    setResponseStatus(event, 201);
    return newFile as unknown as FileDataFromDb;
  } catch (error: any) {
    mongooseErrorHandler(error);
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
