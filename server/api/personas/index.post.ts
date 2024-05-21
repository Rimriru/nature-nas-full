import { personas } from '~/server/models';

export default defineEventHandler(async (event) => {
  const newPersonaBody = await readBody(event);

  try {
    const newPersona = await personas.create(newPersonaBody);
    return newPersona;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
