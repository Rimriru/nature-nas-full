import type { FileDataFromDb } from './FilesDataFromDb';

type Contacts = {
  address: string;
  telNumber: string;
  email: string;
};

interface IJournal {
  description: string;
  cover: string;
  editChief: string;
  editBoard: string;
  editInternatBoard: string;
  authorRules: FileDataFromDb;
  editorialPolicy: FileDataFromDb;
  contacts: Contacts;
}

interface JournalDataFromDb extends IJournal {
  _id: string;
}

export { IJournal, JournalDataFromDb };
