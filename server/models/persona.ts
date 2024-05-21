import mongoose from 'mongoose';

const personasSchema: any = new mongoose.Schema(
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

const Persona = mongoose.model('persona', personasSchema);

export default Persona;
