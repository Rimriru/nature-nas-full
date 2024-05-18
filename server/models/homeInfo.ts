import mongoose from 'mongoose';

const homeInfoSchema: any = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Необходимо указать содержимое']
    }
  },
  { versionKey: false }
);

const HomeInfo = mongoose.model('homeInfo', homeInfoSchema);
export default HomeInfo;
