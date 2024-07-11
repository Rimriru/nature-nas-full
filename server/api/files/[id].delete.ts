import { files } from '~/server/models';
import type { FileDataFromDb } from '~/types/FilesDataFromDb';

export default defineEventHandler(async (event) => {
  const fileId = getRouterParam(event, 'id');
  try {
    const file = (await files.findById(fileId)) as unknown as FileDataFromDb;
    if (file) {
      const { message } = await $fetch(`/api/files/upload/${file.file}`, {
        method: 'delete'
      });
      if (!message) {
        throw createError({
          status: 500,
          message: 'Произола ошибка во время удаления файла'
        });
      }

      await files.findByIdAndDelete(fileId);
      return { message: `Файл "${file.name}" удалён` };
    } else {
      throw createError({
        status: 404,
        message: 'Файл с данным идентификатором не найден'
      });
    }
  } catch (error: any) {
    mongooseErrorHandler(error);
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
