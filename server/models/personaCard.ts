import mongoose from 'mongoose';

const personaCardSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  position: {
    type: String,
    required: [true, 'Требуется должность персоны'],
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  faxNumber: {
    type: String,
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
  },
});

const PersonaCard = mongoose.model('personaCard', personaCardSchema);
export default PersonaCard;
