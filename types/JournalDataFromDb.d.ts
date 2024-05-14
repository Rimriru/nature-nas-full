import type FileDataFromDb from './FilesDataFromDb';

type Contacts = {
  address: string;
  telNumber: string;
  email: string;
};

interface Journal {
  _id: string;
  description: string;
  cover: string;
  editChief: string;
  editBoard: string;
  editInternatBoard: string;
  authorRules: FileDataFromDb;
  editorialPolicy: FileDataFromDb;
  contacts: Contacts;
}

export default Journal;
