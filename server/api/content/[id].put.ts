import { contents } from '../../models/index';

export default defineEventHandler(async (evt) => {
  const id = getRouterParam(evt, 'id');
  const personaId = getRouterParam(evt, 'personaId');
  try {
    const editedContent = await contents.findByIdAndUpdate(
      id,
      {
        $addToSet: {
          personas: personaId
        }
      },
      { new: true }
    );
    return editedContent;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
