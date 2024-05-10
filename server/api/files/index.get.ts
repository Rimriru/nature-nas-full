import { files } from '~/server/models';

export default defineEventHandler(async (event) => {
  try {
    const allFiles = await files.find();
    return allFiles;
  } catch (error: any) {
    return createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
