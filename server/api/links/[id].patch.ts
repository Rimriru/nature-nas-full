import { links, routes } from '../../models/index';
import type { PatchLinkRequestBody } from './types/links';
import type { Link } from '~/types/LinkDataFromDb';

export default defineEventHandler(async (evt) => {
  console.log('PATCH /api/links/[id]');
  const id = getRouterParam(evt, 'id');
  const { title, to } = await readBody<PatchLinkRequestBody>(evt);

  try {
    const linkToEdit = (await links.findById(id)) as Link;
    if (linkToEdit && to === linkToEdit.to) {
      const editedLinkData: Link | null = await links.findByIdAndUpdate(
        id,
        { title },
        { new: true }
      );
      return { editedLinkData, message: `Ссылка "${title}" была изменена` };
    } else {
      const route = await routes.findOne({ path: to });
      const editedLinkData: Link | null = await links.findByIdAndUpdate(
        id,
        { title, to, route },
        { new: true }
      );
      return { editedLinkData, message: `Ссылка "${title}" была изменена` };
    }
  } catch (error: any) {
    console.error(error);
    throw createError({
      status: error.statusCode,
      statusText: error.message
    });
  }
});
