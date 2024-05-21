import { personas } from '~/server/models';

export default defineEventHandler(async () => {
  try {
    const allPersonas = await personas.find();
    return allPersonas;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
