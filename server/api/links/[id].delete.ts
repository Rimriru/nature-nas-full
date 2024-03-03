import { links } from '../../models/index';
import type { Link } from '~/types/LinkDataFromDb';

export default defineEventHandler(async (evt) => {
  console.log('DELETE /api/links/[id]');
  const id = getRouterParam(evt, 'id');
  try {
    const deletedLink = (await links.findByIdAndDelete(id)) as Link;
    if (deletedLink) {
      return { message: `Ссылка '${deletedLink.title}' удалена` };
    }
  } catch (error: any) {
    console.error(error);
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
