import { defineNuxtModule, extendPages } from '@nuxt/kit';
//import { useFetch } from 'nuxt/app';
//import useRoutesFromDb from '../../utils/useRoutesFromDb';
// type RouteDataFromDb = {
//   name: string;
//   path: string;
//   file?: {
//     __hmrId?: string;
//     __file?: string;
//   };
//   _id?: string;
// };

// let routeData: any;

// useRoutesFromDb()
//   .then((data) => {
//     console.log(data);
//     routeData = data;
//   })
//   .catch((err) => console.error(err));

// что за кал здесь происходит?

export default defineNuxtModule({
  setup(options) {
    $fetch('/api/routes')
      .then((routes: any) => {
        routes.map(({ file }) => {
          file: file.__file;
        });
        extendPages((pages) => {
          pages.unshift();
        });
      })
      .catch((error) => console.error(error));
  }
});
