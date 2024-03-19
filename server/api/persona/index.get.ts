import { personas } from '../../models/index';

export default defineEventHandler(async (evt) => {
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
