import { canvases } from '~/utils/canvasesData';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const routes = await useAllRoutes();
  const links = await useLinkGroups();

  const linksState = useLinkGroupsState();
  linksState.value = links;

  const router = useRouter();

  if (routes.length > 0) {
    const isInDb = useRouteFindByPath(routes, to.path);

    if (!isInDb) {
      throw createError({
        statusCode: 404,
        message: `Страница ${to.path} не найдена`
      });
    } else {
      router.addRoute({
        path: isInDb.path,
        name: isInDb.name,
        component: canvases[isInDb.component],
        props: {
          routeData: isInDb
        }
      });

      router.push(isInDb.path);
    }
  } else {
    throw createError({
      statusCode: 500,
      message: `Произошла ошибка при обращении к GET "/api/routes".`
    });
  }
});
