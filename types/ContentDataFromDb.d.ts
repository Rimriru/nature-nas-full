import type PersonaData from './PersonasDataFromDb';
import type { SectionFromDb } from './SectionDataFromDb';

interface ContentFromDb {
  _id: string;
  title: string;
  text: string;
  description: string;
  photos: any[];
  route: string;
  sections: SectionFromDb[];
  personaOne: PersonaData;
  personaTwo: PersonaData;
}

interface CanvasOneContent {
  _id: string;
  title: string;
  text: string;
  description: string;
  photos: any[];
  sections: SectionFromDb[];
  personaOne: PersonaData;
}

interface OriginalContentValues {
  title: string;
  description: string;
  text: string;
  photos: any[];
  personaOne: PersonaData;
}

export { ContentFromDb, CanvasOneContent, OriginalContentValues };
