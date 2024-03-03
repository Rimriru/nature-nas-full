interface RouteDataFromDb {
  path: string;
  component: string;
  _id: string;
  content: {
    title: String;
    text?: String;
    description?: String;
    sections: String;
    personas: [String];
    photos: [{}];
  };
  link: string;
}

export default RouteDataFromDb;
