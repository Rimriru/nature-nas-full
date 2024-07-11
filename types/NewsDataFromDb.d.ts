interface INewsData {
  _id: string;
  title: string;
  description: string;
  content: string;
  cover: string;
  date: string;
}

interface NewsDataFromDb extends INewsData {
  _id: string;
}

export { INewsData, NewsDataFromDb };
