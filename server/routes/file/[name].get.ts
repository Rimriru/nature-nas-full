import path from 'path';
import fs from 'fs';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const base = 'public/docs';

  // on Windows only
  const filePath = path.join(
    `${config.public.process === 'production' ? 'file://' : ''}`,
    base,
    event.context.params!.name
  );

  setHeader(event, 'Cross-Origin-Resource-Policy', 'cross-origin');

  return sendStream(event, fs.createReadStream(filePath));
});
