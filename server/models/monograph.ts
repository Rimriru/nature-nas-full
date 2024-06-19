import { Schema, model } from 'mongoose';
import type { IMonograph } from '~/types/MgraphsDataFromDb';

const monographSchema: Schema<IMonograph> = new Schema(
  {
    title: { type: String, required: true },
    cover: { type: String, required: true },
    description: { type: String, required: true },
    year: { type: String, required: true }
  },
  { versionKey: false }
);

const Monograph = model('monograph', monographSchema);
export default Monograph;
