import { Schema, model } from 'mongoose';
import type { IFile } from '~/types/FilesDataFromDb';

const fileSchema: Schema<IFile> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Необходимо указать имя файла']
    },
    file: {
      type: String,
      required: [true, 'Необходимо указать файл']
    },
    category: {
      type: String
    }
  },
  { versionKey: false }
);

const File = model('file', fileSchema);

export default File;
