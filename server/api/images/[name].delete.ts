import { promises as fs } from 'fs';

export default defineEventHandler({
  handler: async (event) => {
    const name = getRouterParam(event, 'name');

    try {
      await fs.unlink(`public/assets/images/${name}`);
    } catch (error: any) {
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
