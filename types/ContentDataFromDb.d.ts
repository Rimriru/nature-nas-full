import type PersonaData from './PersonasDataFromDb';

interface ContentFromDb {
  _id: string;
  title: string;
  text: string;
  description: string;
  photos: any[];
  route: string;
  sections: string[];
  personaOne: PersonaData;
  personaTwo: PersonaData;
}

interface CanvasOneContent {
  _id: string;
  title: string;
  text: string;
  description: string;
  photos: any[];
  sections: string[];
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
