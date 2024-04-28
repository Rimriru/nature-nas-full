import mongoose from 'mongoose';

const slideSchema: any = new mongoose.Schema(
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

const Slide = mongoose.model('slide', slideSchema);
export default Slide;
