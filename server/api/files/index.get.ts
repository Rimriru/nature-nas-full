import { files } from '~/server/models';

export default defineEventHandler(async (event) => {
  try {
    const allFiles: any = await files.find();
    return allFiles;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
