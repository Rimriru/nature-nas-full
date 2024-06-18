import type Photo from './MainPhotoDataFromDb';
import type FileDataFromDb from './FilesDataFromDb';
import type { NewsDataFromDb } from './NewsDataFromDb';
import type { ContactsDataFromDb } from './ContactsDataFromDb';
import type { ConfDataFromDb } from './ConfsDataFromDb';

type InitialDataType = {
  photo: Photo[];
  files: FileDataFromDb[];
  news: NewsDataFromDb[];
  contacts: ContactsDataFromDb;
  confs: ConfDataFromDb[];
  personas: PersonaInstanceFromDb[];
};

export default InitialDataType;
