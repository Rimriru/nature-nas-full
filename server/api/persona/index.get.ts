import { personas } from '../../models/index';
import type { PersonaDataArray } from '~/types/PersonasDataFromDb';

export default defineEventHandler(async (evt) => {
  try {
    const allPersonas = await personas.find();
    return allPersonas as unknown as PersonaDataArray;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
