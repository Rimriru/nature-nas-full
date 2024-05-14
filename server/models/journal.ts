import mongoose from 'mongoose';

const journalSchema: any = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Необходимо указать описание журнала']
    },
    cover: {
      type: String,
      required: [true, 'Необходимо указать обложку журнала']
    },
    editChief: {
      type: String
    },
    editBoard: {
      type: String
    },
    editInternatBoard: {
      type: String
    },
    authorRules: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'file',
      required: [true, 'Необходимо указать правила для авторов журнала']
    },
    editorialPolicy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'file',
      required: [true, 'Необходимо указать редакционную политику журнала']
    },
    contacts: {
      address: {
        type: String
      },
      telNumber: {
        type: String
      },
      email: {
        type: String
      }
    }
  },
  { versionKey: false }
);

const Journal = mongoose.model('journal', journalSchema);
export default Journal;
