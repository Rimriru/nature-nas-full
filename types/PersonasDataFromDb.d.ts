type IPersonaData = {
  position?: string;
  name?: string;
  phd?: string;
  telNumber?: string;
  faxNumber?: string;
  email?: string;
  description?: string;
  photo?: string;
  placement?: string;
};

interface PersonaInstanceFromDb extends IPersonaData {
  _id: string;
}

export { IPersonaData, PersonaInstanceFromDb };
