import type RouteDataFromDb from '~/types/RouteDataFromDb';

export const useRouteFind = (routes: RouteDataFromDb[], path: string) =>
  routes.find((route) => route.path === path);

export const useAllRoutes = async () => {
  const { data } = await useAsyncData('routes', async () => {
    const oldRoutes = useNuxtData('routes').data.value;
    if (oldRoutes) return oldRoutes;
    const lookingForRoutes = await $fetch('/api/routes');
    return lookingForRoutes;
  });
  return data.value;
};
