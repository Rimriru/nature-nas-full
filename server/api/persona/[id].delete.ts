import { personas } from '../../models/index';

export default defineEventHandler(async (evt) => {
  console.log('DELETE /api/persona/[id]');
  const id = getRouterParam(evt, 'id');
  try {
    const deletedYoungScientist = await personas.findByIdAndDelete(id);
    return { message: 'Карточка персоны удалена' };
  } catch (error: any) {
    console.error(error);
    throw createError({
      status: error.statusCode,
      statusText: error.message
    });
  }
});
