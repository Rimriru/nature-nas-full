import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name');
  //const filePath = path.resolve(__dirname, 'public/assets/images', name);

  try {
    await fs.unlink(`public/assets/images/${name}`);
  } catch (error: any) {
    return createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
