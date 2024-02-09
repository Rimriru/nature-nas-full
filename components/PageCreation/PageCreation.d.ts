interface RouteDataFromDb {
  name: string;
  path: string;
  file?: {
    __hmrId?: string;
    __file?: string;
  };
  _id: string;
}

export default RouteDataFromDb;
