import { conferences } from '~/server/models';

export default defineEventHandler(async (event) => {
  try {
    const allConfs = await conferences.find();
    return allConfs;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
