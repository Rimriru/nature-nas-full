import { Schema, model } from 'mongoose';
import type { INewsData } from '~/types/NewsDataFromDb';

const newsSchema: Schema<INewsData> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Заголовок новости является обязательным']
    },
    description: {
      type: String,
      required: [true, 'Описание новости является обязательным']
    },
    date: {
      type: String,
      required: [true, 'Дата создания новости является обязательной']
    },
    content: {
      type: String,
      required: [true, 'Контент новости является обязательным']
    },
    cover: {
      type: String,
      required: [true, 'Обложка новости является обязательной'],
      validate: /.(?:png|jpg|jpeg)$/
    }
  },
  { versionKey: false }
);

const NewsModel = model('new', newsSchema);
export default NewsModel;
