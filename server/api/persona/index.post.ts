import { personaCards } from '../../models/index';
import YoungScientistRequestBody from './types/youngScientist';

export default defineEventHandler(async (evt) => {
  console.log('POST /api/persona');
  const personaData = await readBody<YoungScientistRequestBody>(evt);
  try {
    console.log("Create new persona");
    const newYoungScientist = await personaCards.create(personaData);
    setResponseStatus(evt, 201);
    return newYoungScientist;
  } catch (error: any) {
    console.dir(error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    });
  }
});