import { Schema, model } from 'mongoose';
import type HomeInfo from '~/types/HomeInfoDataFromDb';

const homeInfoSchema: Schema<HomeInfo> = new Schema(
  {
    content: {
      type: String,
      required: [true, 'Необходимо указать содержимое']
    }
  },
  { versionKey: false }
);

const HomeInfo = model('homeInfo', homeInfoSchema);
export default HomeInfo;
