// type RouteDataFromDb = {
//   name: string;
//   path: string;
//   file?: {
//     __hmrId?: string;
//     __file?: string;
//   };
//   _id?: string;
// };

import { useFetch } from 'nuxt/app';

export default async () => {
  const { data } = await useFetch('/api/routes');
  return data;
};

// const { data } = await useAsyncData('routes', () => $fetch('/api/routes'));
// console.log(data.value);
// // [{ name, path, file: { __hmrId, __file } }, { name, path, file: { __hmrId, __file } }]
// const routeData = data
//   ? data.map(({ name, path, file }: RouteDataFromDb) => {
//       return { name, path, file: file?.__file };
//     })
//   : [];

// export default routeData;
