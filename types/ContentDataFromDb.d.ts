interface ContentFromDb {
  _id: string;
  title: string;
  text: string;
  description: string;
  photos: any[];
  route: string;
  sections: string[];
  personaOne: {
    name: string;
    telNumber: string;
    faxNumber: string;
    email: string;
    description: string;
    photo: {
      path: string;
      filename: string;
    };
  };
  personaTwo: {
    name: string;
    telNumber: string;
    faxNumber: string;
    email: string;
    description: string;
    photo: {
      path: string;
      filename: string;
    };
  };
}

interface CanvasOneContent {
  _id: string;
  title: string;
  text: string;
  description: string;
  photos: any[];
  sections: string[];
  personaOne: {
    name: string;
    telNumber: string;
    faxNumber: string;
    email: string;
    description: string;
    photo: {
      path: string;
      filename: string;
    };
  };
}

interface OriginalContentValues {
  title: string;
  description: string;
  text: string;
  photos: any[];
  personaOne: {
    name: string;
    telNumber: string;
    faxNumber: string;
    email: string;
    description: string;
    photo: {
      path: string;
      filename: string;
    };
  };
}

export { ContentFromDb, CanvasOneContent, OriginalContentValues };
