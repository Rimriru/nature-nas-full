import { conferences } from '~/server/models';
import { IMAGE_LINK_REG_EXP } from '~/utils/regExp';
import auth from '~/server/utils/auth';
import type { ConfDataFromDb } from '~/types/ConfsDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const id = getRouterParam(event, 'id');
    try {
      const confItemForRemoval = (await conferences.findById(id)) as ConfDataFromDb;
      if (confItemForRemoval && !IMAGE_LINK_REG_EXP.test(confItemForRemoval.cover)) {
        await $fetch(`/api/images/${confItemForRemoval.cover}`, {
          method: 'delete'
        });
      }
      await conferences.findByIdAndDelete(id);
      return { message: 'Конференция была удалена' };
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
