interface Contacts {
  address: string;
  telNumber: string;
  faxNumber: string;
  email: string;
}

interface ContactsDataFromDb extends Contacts {
  _id: string;
}

export { Contacts, ContactsDataFromDb };
