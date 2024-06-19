import type { IMonographFromDb } from '~/types/MgraphsDataFromDb';

export const useMgraphsState = () => useState<IMonographFromDb[] | []>('monographs', () => []);

export const useMgraphs = async () => {
  const allMgraphs = await $fetch('/api/mgraphs');
  return allMgraphs;
};
