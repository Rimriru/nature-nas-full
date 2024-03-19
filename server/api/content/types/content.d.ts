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
  personas: string[];
}

export { newRouteContentRequestBody };
