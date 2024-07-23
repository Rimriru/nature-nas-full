import { personas } from '~/server/models';
import type { PersonaInstanceFromDb } from '~/types/PersonasDataFromDb';

export default defineEventHandler(async (event) => {
  const personasId = getRouterParam(event, 'id');
  const editedPersonaBody = await readBody(event);

  try {
    const editedPersona = await personas.findByIdAndUpdate(personasId, editedPersonaBody, {
      new: true
    });
    return editedPersona as unknown as PersonaInstanceFromDb;
  } catch (error: any) {
    mongooseErrorHandler(error);
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
