import mongoose from 'mongoose';
import { links, routes } from '../../models/index';
import type { PatchLinkRequestBody } from './types/links';
import type { Link } from '~/types/LinkDataFromDb';

export default defineEventHandler(async (evt) => {
  const id = getRouterParam(evt, 'id');
  const { title, to } = await readBody<PatchLinkRequestBody>(evt);
  const session = await mongoose.startSession();
  try {
    const result: Promise<Link | null> = session.withTransaction(async () => {
      const linkToEdit = (await links.findById(id)) as Link;
      if (linkToEdit && to === linkToEdit.to) {
        // Если роут не поменялся
        const editedLinkData: Link | null = await links.findByIdAndUpdate(
          id,
          { title },
          { new: true }
        );
        return editedLinkData;
      } else {
        // Если роут был изменён
        const route = await routes.findOne({ path: to });
        const editedLinkData: Link | null = await links.findByIdAndUpdate(
          id,
          { title, to, route },
          { new: true }
        );
        return editedLinkData;
      }
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
