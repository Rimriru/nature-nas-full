import type { ConfDataFromDb } from '~/types/ConfsDataFromDb';

export const useConfsState = () => useState<ConfDataFromDb[]>('confs', () => []);
