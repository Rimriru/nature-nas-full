import mongoose from 'mongoose';

const personaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Требуется имя персоны']
    },
    phoneNumber: {
      type: String,
      default: ''
    },
    faxNumber: {
      type: String
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
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { versionKey: false }
);

const Persona = mongoose.model('persona', personaSchema);
export default Persona;
