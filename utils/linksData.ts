import nanLogo from '/logo-nan.jpg';
import presidentLogo from '/logo-president.jpg';
import governmentLogo from '/logo-government.jpg';
import libLogo from '/logo-lib.jpg';
import centralScienceLibLogo from '/logo-cs-lib.jpeg';
import scienceLogo from '/logo-science.jpg';

const ADMIN_PAGES = [
  { id: 'page-creation', title: 'СОЗДАТЬ СТРАНИЦУ' },
  { id: 'pages-list', title: 'СПИСОК СТРАНИЦ' },
  { id: 'links-list', title: 'СПИСОК ССЫЛОК' },
  { id: 'add-news', title: 'ДОБАВИТЬ НОВОСТЬ' },
  { id: 'add-conf', title: 'ДОБАВИТЬ КОНФЕРЕНЦИЮ' },
  { id: 'download-file', title: 'ЗАГРУЗИТЬ ФАЙЛ' },
  { id: 'files-list', title: 'СПИСОК ФАЙЛОВ' }
];

const HEADER_LINK_GROUPS = [
  {
    _id: 1,
    title: 'Об институте',
    group: 'about',
    icon: 'i-material-symbols-house-rounded'
  },
  {
    _id: 2,
    title: 'Структура',
    group: 'structure',
    icon: 'i-material-symbols-schema-rounded'
  },
  {
    _id: 3,
    title: 'Новости',
    group: 'news',
    icon: 'i-material-symbols-newspaper-rounded'
  },
  {
    _id: 4,
    title: 'Научные издания',
    group: 'publications',
    icon: 'i-material-symbols-menu-book-outline-rounded'
  },
  {
    _id: 5,
    title: 'Исследования и разработки',
    group: 'research',
    icon: 'i-material-symbols-labs-rounded'
  },
  {
    _id: 6,
    title: 'Услуги',
    group: 'service',
    icon: 'i-material-symbols-partner-exchange-rounded'
  },
  {
    _id: 7,
    title: 'Контакты',
    to: '/contacts',
    icon: 'i-material-symbols-contact-phone-rounded'
  },
  {
    _id: 8,
    title: 'Карта сайта',
    to: '/site-map',
    icon: 'i-material-symbols-account-tree-rounded'
  }
];

const FOOTER_LINKS_LOGOS = [
  { to: 'http://nasb.gov.by/', logo: nanLogo, alt: 'Национальная академия наук' },
  { to: 'http://president.gov.by/', logo: presidentLogo, alt: 'Президент Республики Беларусь' },
  {
    to: 'http://www.government.by/ru/',
    logo: governmentLogo,
    alt: 'Правительство Республики Беларусь'
  },
  { to: 'https://www.nlb.by/', logo: libLogo, alt: 'Национальная библиотека Беларуси' },
  {
    to: 'http://csl.bas-net.by/',
    logo: centralScienceLibLogo,
    alt: 'Центральная научная библиотека имени Якуба Коласа Национальной академии наук Беларуси'
  },
  { to: 'http://gazeta-navuka.by/', logo: scienceLogo, alt: 'Научная газета Беларуси' }
];

export { ADMIN_PAGES, HEADER_LINK_GROUPS, FOOTER_LINKS_LOGOS };
