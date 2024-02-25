import type Link from '~/types/LinkDataFromDb';

export const useLinksState: () => globalThis.Ref<Link[]> = () => useState('links', () => []);

export const useLinks = async () => {
  const { data } = await useAsyncData('links', async () => {
    const oldRoutes = useNuxtData('links').data.value;
    if (oldRoutes) return oldRoutes;
    const lookingForRoutes = await $fetch('/api/links');
    return lookingForRoutes;
  });
  return data.value;
};
