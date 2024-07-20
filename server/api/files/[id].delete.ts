import { files } from '~/server/models';

export default defineEventHandler(async (event) => {
  const fileId = getRouterParam(event, 'id');
  const { image } = getQuery(event);

  try {
    const file = (await files.findById(fileId)) as unknown as FileDataFromDb;
    if (!file) {
      throw createError({
        status: 404,
        message: 'Файл с данным идентификатором не найден'
      });
    }
    if (!image) {
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
    } else {
      await $fetch(`/api/images/${file.file}`, {
        method: 'delete'
      });

      await files.findByIdAndDelete(fileId);
    }

    return { message: `Файл "${file.name}" удалён` };
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
