import type { ConfDataFromDb } from '~/types/ConfsDataFromDb';

export const useConfsState = () => useState<ConfDataFromDb[]>('confs', () => []);

export const useConfs = async () => {
  const confsFromDb = await $fetch('/api/confs');
  return confsFromDb;
};
