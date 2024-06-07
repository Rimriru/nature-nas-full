import multer from 'multer';
import { callNodeListener } from 'h3';
import * as crypto from 'crypto';

let uploadedFileName: string;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '.output/public/docs');
  },
  filename: (req, file, cbd) => {
    const rand = crypto.randomUUID();
    const ext = file.originalname.split('.').pop();
    const fileName = rand + '.' + ext;
    uploadedFileName = fileName;
    cbd(null, fileName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 136314880
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'application/pdf' ||
      file.mimetype == 'application/msword' ||
      file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    try {
      await callNodeListener(
        // @ts-expect-error: Nuxt 3
        upload.single('file'),
        event.node.req,
        event.node.res
      );

      return uploadedFileName;
    } catch (error: any) {
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
