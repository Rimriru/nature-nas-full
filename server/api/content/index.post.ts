import { contents } from '../../models/index';

export default defineEventHandler(async (evt) => {
  try {
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
