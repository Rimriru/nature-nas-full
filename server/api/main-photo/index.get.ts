import { mainPhoto } from '~/server/models';

export default defineEventHandler(async () => {
  try {
    const photo: any = await mainPhoto.find({});
    return photo;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
