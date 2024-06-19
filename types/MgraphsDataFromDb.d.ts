interface IMonograph {
  title: string;
  cover: string;
  description: string;
  year: string;
}

interface IMonographFromDb extends IMonograph {
  _id: string;
}

export { IMonograph, IMonographFromDb };
