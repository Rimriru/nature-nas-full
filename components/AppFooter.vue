<script setup lang="ts">
import { HEADER_LINK_GROUPS, FOOTER_LINKS_LOGOS } from '~/utils/linksData';

const linkGroups = useLinkGroupsState();
const contactsState = useContactsState();

const footerLinks = computed(() => {
  return linkGroups.value.filter((group) =>
    ['about', 'structure', 'news', 'publications', 'research', 'service'].includes(group.group)
  );
});

const headerLinks = HEADER_LINK_GROUPS.filter((group) => group.to);

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="footer">
    <div class="footer__container">
      <section class="footer__info">
        <div class="footer__about">
          <h5 class="heading">Институт природопользования НАН Беларуси</h5>
          <p class="inside-text">
            Основная цель института - проведение научных исследований в области природопользования,
            охраны окружающей среды и геотехнологий, геоэкологии, географии и палеогеографии,
            климатологии, гидрогеохимии, гидроэкологии, геодинамики.
          </p>
        </div>
        <div>
          <h5 class="heading">Панель быстрой навигации</h5>
          <nav class="inside-text">
            <ul>
              <li v-for="{ _id, title, links } of footerLinks" :key="_id">
                <NuxtLink :to="links && links.length ? links[0].to : '/'">
                  {{ title }}
                </NuxtLink>
              </li>
              <li v-for="{ title, to } of headerLinks">
                <NuxtLink :to="to">{{ title }}</NuxtLink>
              </li>
            </ul>
          </nav>
        </div>
        <address class="footer__address">
          <h5 class="heading">Реквизиты института</h5>
          <div class="inside-text">
            <p>Адрес: {{ contactsState?.address }}</p>
            <p>
              Телефон:
              <a :href="`tel:${contactsState?.telNumber}`">{{ contactsState?.telNumber }}</a>
            </p>
            <p>
              Факс:
              <a :href="`tel:${contactsState?.faxNumber}`">{{ contactsState?.faxNumber }}</a>
            </p>
            <p>
              Почта:
              <a :href="`mailto:${contactsState?.email}`">{{ contactsState?.email }}</a>
            </p>
          </div>
        </address>
        <div>
          <NuxtLink to="/">
            <NuxtImg
              src="/logo-green.png"
              alt="Логотип"
              width="177"
              sizes="100vw sm:50vw md:512px"
            />
          </NuxtLink>
        </div>
      </section>
      <section class="footer__links">
        <ul>
          <li
            v-for="{ to, logo, alt } of FOOTER_LINKS_LOGOS"
            :key="JSON.stringify({ to, logo, alt })"
          >
            <a :href="to" aria-label="Link">
              <img :src="logo" :alt="alt" class="footer__img" />
            </a>
          </li>
        </ul>
      </section>
      <section class="footer__copyright">
        <span>&copy;</span>
        <time>{{ currentYear }}</time>
        <p>Институт природопользования НАН Беларуси</p>
      </section>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@import url('~/assets/styles/components/appFooter.scss');
</style>
