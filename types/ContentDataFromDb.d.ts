import type { PersonaData } from './PersonasDataFromDb';
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

interface CanvasContent {
  _id: string;
  title: string;
  text: string;
  description: string;
  photos: any[];
  sections: SectionFromDb[];
  personaOne: PersonaData;
  personaTwo: PersonaData;
}

interface OriginalContentValues {
  title: string;
  description: string;
  text: string;
  photos: any[];
  personaOne: PersonaData;
  personaTwo: PersonaData;
}

type CanvasOptions = 'one' | 'two' | 'three' | 'four' | 'five' | 'six';

export { ContentFromDb, CanvasContent, OriginalContentValues, CanvasOptions };
