export default defineNuxtRouteMiddleware((to, from) => {
  const isLoggedIn = useLoggedInState();

  if (!isLoggedIn.value) {
    return navigateTo('/');
  }
});
