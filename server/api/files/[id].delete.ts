import { files } from '~/server/models';

export default defineEventHandler(async (event) => {
  const fileId = getRouterParam(event, 'id');
  try {
    const file = await files.findById(fileId);
    const { message } = await $fetch(`/api/files/upload/${file.file}`, {
      method: 'delete'
    });
    if (message) {
      await files.findByIdAndDelete(fileId);
      return { message: `Файл "${file.name}" удалён` };
    } else {
      throw createError({
        status: 500,
        message: 'Произола ошибка во время удаления файла'
      });
    }
  } catch (error: any) {
    return createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
