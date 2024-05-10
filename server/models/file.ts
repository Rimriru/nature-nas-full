import mongoose from 'mongoose';

const fileSchema: any = new mongoose.Schema(
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

const File = mongoose.model('file', fileSchema);

export default File;
