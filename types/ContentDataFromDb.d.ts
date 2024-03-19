interface Content {
  _id: string;
  title: string;
  text: string;
  description: string;
  photos: any[];
  route: string;
  sections: string[];
  personas: string[];
}

interface OriginalContentValues {
  title: string;
  description: string;
  text: string;
  photos: any[];
}

export { Content, OriginalContentValues };
