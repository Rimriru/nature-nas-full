import type { NewsDataFromDb } from '~/types/NewsDataFromDb';

export const useNewsState = () => useState<NewsDataFromDb[]>('news', () => []);
