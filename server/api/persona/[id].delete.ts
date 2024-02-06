import { personaCards } from '../../models/index';

export default defineEventHandler(async (evt) => {
  console.log('DELETE /api/persona/[id]');
  const id = getRouterParam(evt, 'id');
  try {
    const deletedYoungScientist = await personaCards.findByIdAndDelete(id);
    return { message: 'Карточка персоны удалена' };
  } catch (error: any) {
    console.dir(error);
  }
});
