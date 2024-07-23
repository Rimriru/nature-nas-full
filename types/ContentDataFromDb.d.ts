import type { ObjectId } from 'mongoose';
import type { IPersonaData } from './PersonasDataFromDb';
import type { SectionFromDb } from './SectionDataFromDb';

interface IContent {
  title: string;
  text?: string;
  description?: string;
  photos?: string[];
  route: ObjectId;
  sections: SectionFromDb[];
  personaOne: IPersonaData;
  personaTwo: IPersonaData;
}

interface ContentFromDb extends IContent {
  _id: ObjectId | string;
}

type CanvasContent = Omit<ContentFromDb, 'route'>;

interface OriginalContentValues {
  title: string;
  description: string;
  text: string;
  photos: string[];
  personaOne: IPersonaData;
  personaTwo: IPersonaData;
}

type CanvasOptions = 'one' | 'two' | 'three' | 'four' | 'five' | 'six';

export { IContent, ContentFromDb, CanvasContent, OriginalContentValues, CanvasOptions };
