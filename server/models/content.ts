import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Требуется заголовок страницы']
    },
    text: String,
    description: String,
    sections: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'section',
      default: []
    },
    personas: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'persona'
    },
    photos: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    }
  },
  { versionKey: false }
);

const Content = mongoose.model('content', contentSchema);
export default Content;
