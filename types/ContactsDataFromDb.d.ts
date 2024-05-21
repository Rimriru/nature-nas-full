interface Contacts {
  address: string;
  telNumber: string;
  faxNumber: string;
  email: string;
  content: string;
}

interface ContactsDataFromDb extends Contacts {
  _id: string;
}

export { Contacts, ContactsDataFromDb };
