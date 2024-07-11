import type { ContactsDataFromDb } from '~/types/ContactsDataFromDb';

export const useContactsState: () => globalThis.Ref<ContactsDataFromDb | null> = () =>
  useState('contacts', () => null);
