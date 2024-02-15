import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Требуется название страницы'],
      unique: true
    },
    path: {
      type: String,
      required: [true, 'Требуется путь страницы'],
      unique: true
    },
    component: {
      type: String,
      required: [true, 'Требуется шаблон страницы']
    }
  },
  { versionKey: false }
);

const Route = mongoose.model('route', routeSchema);
export default Route;
