interface Section {
  title: string;
  content: string;
}

interface SectionFromDb {
  _id: string;
  title: string;
  content: string;
}

export { Section, SectionFromDb };
