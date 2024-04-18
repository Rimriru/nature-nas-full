import { mainPhoto } from '~/server/models';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  try {
    const updatedPhoto = await mainPhoto.findByIdAndUpdate(id, body, { new: true });
    return updatedPhoto;
  } catch (error: any) {
    return createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
