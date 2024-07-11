const CONFLICT_ROUTE_ERROR_MESSAGE =
  'Ошибка 409: страница с таким названием или контент для этой страницы уже существует';
const NOT_FOUND_ERROR_MESSAGE = 'Ошибка 404: страница таким адресом не найдена';
const BAD_REQUEST_ERROR_MESSAGE =
  'Ошибка 400: отсутствует необходимый параметр для запроса – id/body';
const UNAUTHORIZED_ERROR_MESSAGE = 'Ошибка 401: недостаточно прав для проведения данной операции';
const FORBIDDEN_ERROR_MESSAGE = 'Ошибка 403: недостаточно прав для проведения данной операции';

const fileSizeError = (size: string) => `Размер загружаемого файла превышает ${size} мб!`;
const NEWS_COVER_REQUIRED_ERROR = 'Необходимо загрузить или вставить ссылку на обложку';
const IMAGE_LINK_VALIDATION_ERROR =
  'Ссылка на изображение должна начинаться с http или https и оканчиваться форматом (".png"/".jpg"/".jpeg")';
const PAGE_LINK_VALIDATION_ERROR =
  'Ссылка должна начинаться с / и содержать строчные латинские символы после';

export {
  CONFLICT_ROUTE_ERROR_MESSAGE,
  NOT_FOUND_ERROR_MESSAGE,
  BAD_REQUEST_ERROR_MESSAGE,
  UNAUTHORIZED_ERROR_MESSAGE,
  FORBIDDEN_ERROR_MESSAGE,
  fileSizeError,
  NEWS_COVER_REQUIRED_ERROR,
  IMAGE_LINK_VALIDATION_ERROR,
  PAGE_LINK_VALIDATION_ERROR
};
