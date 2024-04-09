import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Требуется название группы']
    },
    group: {
      type: String
    },
    links: [{ type: mongoose.Schema.Types.ObjectId, ref: 'link' }]
  },
  { versionKey: false }
);

const Group = mongoose.model('group', groupSchema);
export default Group;
