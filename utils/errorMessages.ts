const CONFLICT_ROUTE_ERROR_MESSAGE =
  'Ошибка 409: страница с таким названием или контент для этой страницы уже существует';
const NOT_FOUND_ERROR_MESSAGE = 'Ошибка 404: страница таким адресом не найдена';
const BAD_REQUEST_ERROR_MESSAGE =
  'Ошибка 400: отсутствует необходимый параметр для запроса – id/body';

const FILE_SIZE_ERROR_BEYOND_2_MB = 'Размер загружаемого файла превышает 2,5 мб!';
const NEWS_COVER_REQUIRED_ERROR = 'Необходимо загрузить или вставить ссылку на обложку';
const LINK_VALIDATION_ERROR =
  'Ссылка на изображение должна начинаться с http или https и оканчиваться форматом (".png"/".jpg"/".jpeg")';

export {
  CONFLICT_ROUTE_ERROR_MESSAGE,
  NOT_FOUND_ERROR_MESSAGE,
  BAD_REQUEST_ERROR_MESSAGE,
  FILE_SIZE_ERROR_BEYOND_2_MB,
  NEWS_COVER_REQUIRED_ERROR,
  LINK_VALIDATION_ERROR
};
