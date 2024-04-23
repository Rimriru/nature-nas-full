interface NewsCardData {
  _id: string;
  title: string;
  description: string;
  cover: string;
  creationDate: string;
}

interface NewsDataFromDb extends NewsCardData {
  content: string;
}

export { NewsCardData, NewsDataFromDb };
