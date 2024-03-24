import path from 'path';
import fs from 'fs';

export default defineEventHandler(async (event) => {
  const images = await readMultipartFormData(event);
  images?.forEach((file) => {
    const filePath = path.join('public', file.filename as string);
    fs.writeFileSync(filePath, file.data);
  });
  return 201;
});
