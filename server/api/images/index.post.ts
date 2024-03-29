import multer from 'multer';
import { callNodeListener } from 'h3';
import * as crypto from 'crypto';

const allFileNames: string[] = [];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/images');
  },
  filename: (req, file, cbd) => {
    const rand = crypto.randomUUID();
    const ext = file.originalname.split('.').pop();
    const fileName = rand + '.' + ext;
    allFileNames.push(fileName);
    cbd(null, fileName);
  }
});

// только jpeg & png
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5242880
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

export default defineEventHandler(async (event) => {
  try {
    await callNodeListener(
      // @ts-expect-error: Nuxt 3
      upload.any('images'),
      event.node.req,
      event.node.res
    );
    return allFileNames;
  } catch (error: any) {
    return createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
