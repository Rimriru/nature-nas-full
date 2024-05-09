import { conferences } from '~/server/models';
import auth from '~/server/utils/auth';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    try {
      const editedConf = await conferences.findByIdAndUpdate(id, body, { new: true });
      return editedConf;
    } catch (error: any) {
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
