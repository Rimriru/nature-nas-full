import type { ContactsDataFromDb } from '~/types/ContactsDataFromDb';

export const useContactsState: () => globalThis.Ref<ContactsDataFromDb | null> = () =>
  useState('contacts', () => null);

export const useContacts = async () => {
  const contactsData = await $fetch('/api/contacts');
  return contactsData;
};
