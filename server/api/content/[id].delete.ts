import mongoose from 'mongoose';
import { contents } from '../../models/index';
import type { ContentFromDb } from '~/types/ContentDataFromDb';

export default defineEventHandler(async (evt) => {
  const id = getRouterParam(evt, 'id');
  const session = await mongoose.startSession();
  try {
    const result: Promise<{ message: string }> = session.withTransaction(async () => {
      const deletedContent = (await contents.findOneAndDelete({ route: id })) as ContentFromDb;
      // если было фото у контакта
      if (deletedContent.personaOne.photo) {
        await $fetch(`/api/images/${deletedContent.personaOne.photo}`, {
          method: 'delete',
          onResponse({ response }) {
            if (!response.ok) {
              throw createError({
                status: response.status,
                message: response.statusText
              });
            }
          }
        });
      }

      if (deletedContent.photos && deletedContent.photos.length > 0) {
        await $fetch('/api/images', {
          method: 'delete',
          body: deletedContent.photos,
          onResponse({ response }) {
            if (!response.ok) {
              throw createError({
                status: response.status,
                message: response.statusText
              });
            }
          }
        });
      }

      return { message: 'Контент удалён' };
    });

    return result;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  } finally {
    session.endSession();
  }
});
