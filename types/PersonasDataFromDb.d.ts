interface PersonaData {
  name: string;
  telNumber: string;
  faxNumber: string;
  email: string;
  description: string;
  photo: string;
}

type PersonaDataArray = PersonaData[];

export { PersonaData, PersonaDataArray };
