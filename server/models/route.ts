import { Schema, model } from 'mongoose';
import type { IRoute } from '~/types/RouteDataFromDb';

const routeSchema: Schema<IRoute> = new Schema(
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

const Route = model('route', routeSchema);
export default Route;
