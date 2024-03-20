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
  personaData: {
    name: string;
    telNumber: string;
    faxNumber: string;
    email: string;
    description: string;
    photo: any;
  };
}

export { Content, OriginalContentValues };
