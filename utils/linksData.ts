import fillHomeIcon from '~/assets/images/fill-home-icon.svg';
import structureIcon from '~/assets/images/structure-icon.svg';
import newsIcon from '~/assets/images/news-icon.svg';
import publicationsIcon from '~/assets/images/publications-icon.svg';
import researchIcon from '~/assets/images/research-icon.svg';
import serviceIcon from '~/assets/images/service-icon.svg';
import contactsIcon from '~/assets/images/contacts-icon.svg';
import siteMapIcon from '~/assets/images/fill-map-icon.svg';

const ADMIN_PAGES = [
  { id: 'page-creation', title: 'СОЗДАТЬ СТРАНИЦУ' },
  { id: 'pages-list', title: 'СПИСОК СТРАНИЦ' },
  { id: 'links-list', title: 'СПИСОК ССЫЛОК' },
  { id: 'add-news', title: 'ДОБАВИТЬ НОВОСТЬ' }
];

const HEADER_LINK_GROUPS = [
  {
    id: 1,
    title: 'Об институте',
    group: 'about',
    icon: fillHomeIcon
  },
  {
    id: 2,
    title: 'Структура',
    group: 'structure',
    icon: structureIcon
  },
  {
    id: 3,
    title: 'Новости',
    group: 'news',
    icon: newsIcon
  },
  {
    id: 4,
    title: 'Научные издания',
    group: 'publications',
    icon: publicationsIcon
  },
  {
    id: 5,
    title: 'Исследования и разработки',
    group: 'research',
    icon: researchIcon
  },
  {
    id: 6,
    title: 'Услуги',
    group: 'service',
    icon: serviceIcon
  },
  {
    id: 7,
    title: 'Контакты',
    to: '/contacts',
    icon: contactsIcon
  },
  {
    id: 8,
    title: 'Карта сайта',
    to: '/site-map',
    icon: siteMapIcon
  }
];

export { ADMIN_PAGES, HEADER_LINK_GROUPS };
