import mongoose from 'mongoose';

const mainPhotoSchema: any = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Необходимо указать имя файла']
    }
  },
  { versionKey: false }
);

const MainPhoto = mongoose.model('mainPhoto', mainPhotoSchema);
export default MainPhoto;
