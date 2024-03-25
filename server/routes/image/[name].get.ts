import path from 'path';
import fs from 'fs';

export default defineEventHandler(async (event) => {
  const base = 'public/assets/images';
  const filePath = path.join(base, event.context.params!.name);

  return sendStream(event, fs.createReadStream(filePath));
});
