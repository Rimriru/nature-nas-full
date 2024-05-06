interface ConfCardData {
  _id: string;
  description: string;
  cover: string;
  startDate: string;
  endDate?: string;
}

interface ConfDataFromDb extends ConfCardData {
  content: string;
}

export { ConfCardData, ConfDataFromDb };
