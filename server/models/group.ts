import { Schema, model } from 'mongoose';
import type { LinkGroup } from '~/types/LinkDataFromDb';

const groupSchema: Schema<LinkGroup> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Требуется название группы']
    },
    group: {
      type: String
    },
    links: [{ type: Schema.Types.ObjectId, ref: 'link' }]
  },
  { versionKey: false }
);

const Group = model('group', groupSchema);
export default Group;
