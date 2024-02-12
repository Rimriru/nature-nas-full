import type RouteDataFromDb from '~/types/RouteDataFromDb';

export const useRoutes = () => useState<RouteDataFromDb[]>('routes', () => []);

export const useRouteFind = (routes: RouteDataFromDb[], path: string) =>
  routes.find((route) => route.path === path);
