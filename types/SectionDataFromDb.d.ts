interface ISection {
  title: string;
  content: string;
}

interface SectionFromDb extends ISection {
  _id: string;
}

export { ISection, SectionFromDb };
