interface IRoute {
  name: string;
  path: string;
  component: string;
}

interface RouteDataFromDb extends IRoute {
  _id: string;
}

export { IRoute, RouteDataFromDb };
