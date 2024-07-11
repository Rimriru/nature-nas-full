import type { ObjectId } from 'mongoose';

interface IContacts {
  address: string;
  telNumber: string;
  faxNumber: string;
  email: string;
  content: string;
}

interface ContactsDataFromDb extends IContacts {
  readonly _id: ObjectId;
}

export { IContacts, ContactsDataFromDb };
