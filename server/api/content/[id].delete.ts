import { contents } from '../../models/index';
import type { ContentFromDb } from '~/types/ContentDataFromDb';

export default defineEventHandler(async (evt) => {
  const id = getRouterParam(evt, 'id');
  try {
    const deletedContent = await contents.findOneAndDelete({ route: id });
    if (deletedContent) {
      const deletedContentInsides = deletedContent as unknown as ContentFromDb;
      // если было фото у контакта
      if (deletedContentInsides.personaOne.photo) {
        await $fetch(`/api/images/${deletedContentInsides.personaOne.photo}`, {
          method: 'delete'
        });
        console.log('Фото удалено');
      }

      if (deletedContentInsides.photos && deletedContentInsides.photos.length > 0) {
      }

      return { message: 'Контент удалён' };
    }
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
