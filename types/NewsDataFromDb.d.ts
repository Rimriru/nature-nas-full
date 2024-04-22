interface NewsCardData {
  _id: string;
  title: string;
  description: string;
  cover: string;
  date: string;
}

interface NewsDataFromDb extends NewsCardData {
  content: string;
}

export { NewsCardData, NewsDataFromDb };
