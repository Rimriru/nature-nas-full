import type Journal from '~/types/JournalDataFromDb';

export const useJournalState = () => useState<Journal | null>('journal', () => null);

export const useJournal = async () => {
  const journal = await $fetch('/api/journal');
  return journal;
};
