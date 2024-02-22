import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Требуется название секции']
    },
    text: {
      type: String,
      required: [true, 'Требуется содержимое секции']
    }
  },
  { versionKey: false }
);

const Section = mongoose.model('section', sectionSchema);
export default Section;
