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
    group: {
      type: String,
      enum: ['about', 'structure', 'news', 'publications', 'research', 'service'],
      required: [true, 'Необходимо указание на группу ссылок']
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Необходимо передать роут']
    },
    createdByAdmin: {
      type: Boolean,
      required: [true, 'Требуется указать, создана ли ссылка админом']
    }
  },
  { versionKey: false }
);

const Link = mongoose.model('link', linkSchema);
export default Link;
