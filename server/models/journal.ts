import { Schema, model } from 'mongoose';
import type { IJournal } from '~/types/JournalDataFromDb';

const journalSchema: Schema<IJournal> = new Schema(
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
      type: Schema.Types.ObjectId,
      ref: 'file',
      required: [true, 'Необходимо указать правила для авторов журнала']
    },
    editorialPolicy: {
      type: Schema.Types.ObjectId,
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

const Journal = model('journal', journalSchema);
export default Journal;
