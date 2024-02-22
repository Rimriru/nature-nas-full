import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Требуется название имя ссылки']
    },
    group: {
      type: String,
      enum: ['about', 'structure', 'news', 'publications', 'research', 'service'],
      required: [true, 'Необходимо указание на группу ссылок']
    }
  },
  { versionKey: false }
);

const Link = mongoose.model('link', linkSchema);
export default Link;
