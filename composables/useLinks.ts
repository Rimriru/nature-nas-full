import type { Link } from '~/types/LinkDataFromDb';

export const useLinksState: () => globalThis.Ref<Link[]> = () => useState('links', () => []);

export const useLinks = async () => {
  const data = await $fetch('/api/links');

  if (!data) {
    return [];
  } else {
    return data;
  }
};
