export default defineNuxtRouteMiddleware((to, from) => {
  useSeoMeta({
    title: 'Институт природопользования НАН Беларуси'
  });
});
