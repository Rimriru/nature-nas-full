import { personas } from '~/server/models';

export default defineEventHandler(async (event) => {
  const personasId = getRouterParam(event, 'id');
  const editedPersonaBody = await readBody(event);

  try {
    const editedPersona = await personas.findByIdAndUpdate(personasId, editedPersonaBody, {
      new: true
    });
    return editedPersona;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
