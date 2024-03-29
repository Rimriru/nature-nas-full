import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Требуется название секции']
    },
    content: {
      type: String,
      required: [true, 'Требуется содержимое секции']
    }
  },
  { versionKey: false }
);

const Section = mongoose.model('section', sectionSchema);
export default Section;
