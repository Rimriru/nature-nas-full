type PersonaData = {
  position: string;
  name: string;
  phd: string;
  telNumber: string;
  faxNumber: string;
  email: string;
  description: string;
  photo: string;
};

interface PersonaInstanceFromDb {
  _id: string;
  position: string;
  name: string;
  phd: string;
  telNumber: string;
  faxNumber: string;
  email: string;
  description: string;
  photo: string;
  placement: string;
}

export { PersonaData, PersonaInstanceFromDb };
