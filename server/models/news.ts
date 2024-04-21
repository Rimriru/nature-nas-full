import mongoose from 'mongoose';

const newsSchema: any = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Заголовок новости является обязательным']
    },
    description: {
      type: String,
      required: [true, 'Описание новости является обязательным']
    },
    creationDate: {
      type: String,
      required: [true, 'Дата создания новости является обязательной']
    },
    content: {
      type: String,
      required: [true, 'Контент новости является обязательным']
    },
    cover: {
      type: String,
      required: [true, 'Обложка новости является обязательной']
    }
  },
  { versionKey: false }
);

const NewsModel = mongoose.model('new', newsSchema);
export default NewsModel;
