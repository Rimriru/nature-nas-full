import { personaCards } from '../../models/index';
import PersonaRequestBody from './types/youngScientist';

export default defineEventHandler(async (evt) => {
  console.log('PATCH /api/persona/[id]');
  const id = evt.context.params?.id;
  const personaData = await readBody<PersonaRequestBody>(evt);
  try {
    const editedPersona = await personaCards.findByIdAndUpdate(id, personaData, { new: true });
    return editedPersona;
  } catch (error: any) {
    console.dir(error);
  }
});