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
      required: [true, 'Необходимо передать роут'],
      ref: 'route'
    }
  },
  { versionKey: false }
);

const Link = mongoose.model('link', linkSchema);
export default Link;
