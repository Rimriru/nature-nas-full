import mongoose from 'mongoose';
import { links } from '../../models/index';
import type { Link } from '~/types/LinkDataFromDb';

export default defineEventHandler(async (evt) => {
  const linkId = getRouterParam(evt, 'id');
  const { groupId } = getQuery(evt);
  const session = await mongoose.startSession();
  try {
    const result = session.withTransaction(async () => {
      const deletedLink = (await links.findByIdAndDelete(linkId)) as Link;
      if (deletedLink) {
        const editedGroup = await $fetch(`/api/link-groups/links/${groupId}`, {
          method: 'delete',
          query: {
            linkId
          }
        });

        if (editedGroup) {
          return { message: `Ссылка '${deletedLink.title}' удалена`, editedGroup };
        } else {
          throw createError({
            status: 500,
            message: 'Произошла ошибка во время выполнения запроса /api/link-groups/links'
          });
        }
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
