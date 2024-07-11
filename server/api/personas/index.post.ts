import { personas } from '~/server/models';
import type { PersonaInstanceFromDb } from '~/types/PersonasDataFromDb';

export default defineEventHandler(async (event) => {
  const newPersonaBody = await readBody(event);

  try {
    const newPersona = await personas.create(newPersonaBody);
    setResponseStatus(event, 201);
    return newPersona as unknown as PersonaInstanceFromDb;
  } catch (error: any) {
    mongooseErrorHandler(error);
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
