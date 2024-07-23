import { Schema, model } from 'mongoose';
import type { IContent } from '~/types/ContentDataFromDb';

const contentSchema: Schema<IContent> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Требуется заголовок страницы']
    },
    text: String,
    description: String,
    sections: [
      {
        type: Schema.Types.ObjectId,
        ref: 'section'
      }
    ],
    personaOne: {
      position: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      },
      phd: {
        type: String,
        default: ''
      },
      telNumber: {
        type: String,
        default: ''
      },
      faxNumber: {
        type: String,
        default: ''
      },
      email: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
      },
      photo: {
        type: String
      }
    },
    personaTwo: {
      name: {
        type: String
      },
      telNumber: {
        type: String
      },
      faxNumber: {
        type: String
      },
      email: {
        type: String
      },
      description: {
        type: String
      },
      photo: {
        type: String
      }
    },
    photos: {
      type: [String]
    },
    route: {
      type: Schema.Types.ObjectId,
      required: [true, 'Необходимо передать роут'],
      unique: true
    }
  },
  { versionKey: false }
);

const Content = model('content', contentSchema);
export default Content;
