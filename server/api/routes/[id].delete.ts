import mongoose from 'mongoose';
import { routes, links, groups } from '../../models/index';
import type { Link } from '~/types/LinkDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (evt) => {
    const id = getRouterParam(evt, 'id');
    const session = await mongoose.startSession();

    try {
      const result = session.withTransaction(async () => {
        // удаление роута
        await routes.findByIdAndDelete(id);

        // удаление ссылок
        const thisRouteLinks = (await links.find({ route: id })) as Link[];
        await links.deleteMany({ route: id });
        if (thisRouteLinks.length) {
          for (const link of thisRouteLinks) {
            await groups.updateMany({}, { $pull: { links: link._id } });
          }
        }

        // удаление контента
        await $fetch(`/api/content/${id}`, {
          method: 'delete'
        });

        return { message: 'Страница с ссылками удалена', links: thisRouteLinks };
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
  }
});
