import type { NewsDataFromDb } from '~/types/NewsDataFromDb';

export const useNewsState = () => useState<NewsDataFromDb[]>('news', () => []);

export const useNewsRequest = async () => {
  const allNews = await $fetch('/api/news');
  return allNews as unknown as NewsDataFromDb[];
};
