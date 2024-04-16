import fillHomeIcon from '~/assets/images/fill-home-icon.svg';
import structureIcon from '~/assets/images/structure-icon.svg';
import newsIcon from '~/assets/images/news-icon.svg';
import publicationsIcon from '~/assets/images/publications-icon.svg';
import researchIcon from '~/assets/images/research-icon.svg';
import serviceIcon from '~/assets/images/service-icon.svg';
import contactsIcon from '~/assets/images/contacts-icon.svg';
import siteMapIcon from '~/assets/images/fill-map-icon.svg';

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
  { id: 'add-news', title: 'ДОБАВИТЬ НОВОСТЬ' }
];

const HEADER_LINK_GROUPS = [
  {
    _id: 1,
    title: 'Об институте',
    group: 'about',
    icon: fillHomeIcon
  },
  {
    _id: 2,
    title: 'Структура',
    group: 'structure',
    icon: structureIcon
  },
  {
    _id: 3,
    title: 'Новости',
    group: 'news',
    icon: newsIcon
  },
  {
    _id: 4,
    title: 'Научные издания',
    group: 'publications',
    icon: publicationsIcon
  },
  {
    _id: 5,
    title: 'Исследования и разработки',
    group: 'research',
    icon: researchIcon
  },
  {
    _id: 6,
    title: 'Услуги',
    group: 'service',
    icon: serviceIcon
  },
  {
    _id: 7,
    title: 'Контакты',
    to: '/contacts',
    icon: contactsIcon
  },
  {
    _id: 8,
    title: 'Карта сайта',
    to: '/site-map',
    icon: siteMapIcon
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
