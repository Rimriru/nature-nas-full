import type { JournalDataFromDb } from '~/types/JournalDataFromDb';

export const useJournalState = () => useState<JournalDataFromDb | null>('journal', () => null);

export const useJournal = async () => {
  const journal = await $fetch('/api/journal');
  return journal;
};
