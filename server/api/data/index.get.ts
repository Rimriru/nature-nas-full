import type InitialDataType from '~/types/InitialDataFormDb';

export default defineEventHandler(async (event) => {
  try {
    const mainPhoto = await $fetch('/api/main-photo');
    const allFilesFromDb = await $fetch('/api/files');
    const allNews = await $fetch('/api/news');
    const contactsData = await $fetch('/api/contacts');
    const confsFromDb = await $fetch('/api/confs');
    const allPersonas = await $fetch('/api/personas');

    return {
      photo: mainPhoto,
      files: allFilesFromDb,
      news: allNews,
      contacts: contactsData,
      confs: confsFromDb,
      personas: allPersonas
    };
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
