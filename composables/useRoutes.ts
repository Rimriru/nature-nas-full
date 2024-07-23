import type { RouteDataFromDb } from '~/types/RouteDataFromDb';

export const useRoutesState: () => globalThis.Ref<RouteDataFromDb[]> = () =>
  useState('routes', () => []);

export const useRouteFindByPath = (routes: RouteDataFromDb[], path: string) =>
  routes.find((route) => route.path === path);

export const useAllRoutes = async () => {
  const data = await $fetch('/api/routes');

  return data ? data : [];
};
