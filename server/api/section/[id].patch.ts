import { sections } from '../../models/index';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const sectionBody = await readBody(event);

  if (!id || !sectionBody) {
    throw createError({
      status: 400,
      message: 'Отсутствует необходимый параметр для запроса – id/body'
    });
  }

  try {
    const updatedSection = await sections.findByIdAndUpdate(id, sectionBody, { new: true });
    const message = `Раздел ${sectionBody.title} был изменён`;
    return { message, updatedSection };
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
