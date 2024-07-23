import { Schema, model } from 'mongoose';
import type { ISection } from '~/types/SectionDataFromDb';

const sectionSchema: Schema<ISection> = new Schema(
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

const Section = model('section', sectionSchema);
export default Section;
