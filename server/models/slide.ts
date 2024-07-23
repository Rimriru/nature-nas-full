import { Schema, model } from 'mongoose';
import type Slide from '~/types/SlideDataFromDb';

const slideSchema: Schema<Slide> = new Schema(
  {
    img: {
      type: String,
      required: [true, 'Изображение является обязательным']
    },
    content: {
      type: String,
      required: [true, 'Содержимое слайда является обязательным']
    },
    placement: {
      type: String,
      required: [true, 'Расположение слайда является обязательным'],
      enum: ['home-1', 'home-2']
    }
  },
  { versionKey: false }
);

const Slide = model('slide', slideSchema);
export default Slide;
