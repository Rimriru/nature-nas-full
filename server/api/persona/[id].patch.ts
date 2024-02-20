import { personas } from '../../models/index';
import PersonaRequestBody from './types/persona';

export default defineEventHandler(async (evt) => {
  console.log('PATCH /api/persona/[id]');
  const id = getRouterParam(evt, 'id');
  const personaData = await readBody<PersonaRequestBody>(evt);
  try {
    const editedPersona = await personas.findByIdAndUpdate(id, personaData, { new: true });
    return editedPersona;
  } catch (error: any) {
    console.dir(error);
  }
});
