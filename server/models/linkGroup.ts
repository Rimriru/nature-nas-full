import mongoose from 'mongoose';

const linkGroupSchema = new mongoose.Schema(
  {
    group: String,
    title: String,
    links: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'link'
    }
  },
  { versionKey: false }
);

const LinkGroup = mongoose.model('linkGroup', linkGroupSchema);
export default LinkGroup;
