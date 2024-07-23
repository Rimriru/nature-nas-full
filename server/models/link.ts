import { Schema, model } from 'mongoose';
import type { ILink } from '~/types/LinkDataFromDb';

const linkSchema: Schema<ILink> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Требуется название имя ссылки']
    },
    to: {
      type: String,
      required: [true, 'Требуется указать ссылку']
    },
    route: {
      type: Schema.Types.ObjectId,
      ref: 'route'
    },
    couldBeEdited: {
      type: Boolean,
      default: true
    }
  },
  { versionKey: false }
);

const Link = model('link', linkSchema);
export default Link;
