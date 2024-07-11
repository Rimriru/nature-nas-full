import { Schema, model } from 'mongoose';
import type { IContacts } from '~/types/ContactsDataFromDb';

const contactSchema: Schema<IContacts> = new Schema(
  {
    address: {
      type: String,
      required: [true, 'Необходимо ввести адрес']
    },
    telNumber: {
      type: String,
      required: [true, 'Необходимо ввести номер телефона']
    },
    faxNumber: {
      type: String,
      required: [true, 'Необходимо ввести номер факса']
    },
    email: {
      type: String,
      required: [true, 'Необходимо ввести адре электронной почты']
    },
    content: {
      type: String
    }
  },
  { versionKey: false }
);

const Contact = model('contact', contactSchema);
export default Contact;
