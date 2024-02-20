import mongoose from 'mongoose';

const personaSchema = new mongoose.Schema({
  name: {
    type: String
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
});

const PersonaCard = mongoose.model('personaCard', personaSchema);
export default PersonaCard;
