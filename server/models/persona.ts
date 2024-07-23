import { Schema, model } from 'mongoose';
import type { IPersonaData } from '~/types/PersonasDataFromDb';

const personasSchema: Schema<IPersonaData> = new Schema(
  {
    position: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    phd: {
      type: String,
      default: ''
    },
    telNumber: {
      type: String,
      default: ''
    },
    faxNumber: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    photo: {
      type: String
    },
    placement: {
      type: String,
      required: [true, 'Необходимо указать расположение контакта']
    }
  },
  { versionKey: false }
);

const Persona = model('persona', personasSchema);

export default Persona;
