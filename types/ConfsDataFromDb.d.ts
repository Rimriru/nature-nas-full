interface IConference {
  description: string;
  cover: string;
  startDate: string;
  endDate?: string;
  content: string;
}

interface ConfDataFromDb extends IConference {
  _id: string;
}

export { IConference, ConfDataFromDb };
