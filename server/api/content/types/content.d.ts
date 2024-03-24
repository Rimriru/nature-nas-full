interface newRouteContentRequestBody {
  title: {
    type: string;
    required: true;
  };
  text: string;
  description: string;
  photos: [];
  route: {
    type: string;
    required: true;
  };
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

export { newRouteContentRequestBody };
