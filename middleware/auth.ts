export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('jwt');

  if (!token) {
    return navigateTo('/');
  }
});
