import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema(
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'route'
    },
    couldBeEdited: {
      type: Boolean,
      default: true
    }
  },
  { versionKey: false }
);

const Link = mongoose.model('link', linkSchema);
export default Link;
