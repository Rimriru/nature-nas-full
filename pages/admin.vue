<script setup lang="ts">
import { ADMIN_PAGES } from '~/utils/linksData';

const whatPageIsShown = ref('page-creation');

const handleMenuButtonClick = (pageId: string) => {
  whatPageIsShown.value = pageId;
};

useServerSeoMeta({
  robots: 'none noarchive nositelinkssearchbox'
});

definePageMeta({
  middleware: 'auth'
});
</script>

<template>
  <main class="admin">
    <ul class="admin__menu">
      <li v-for="({ id, title }, index) in ADMIN_PAGES" :key="index">
        <MenuButton
          :is-active="whatPageIsShown === id ? true : false"
          @click="handleMenuButtonClick(id)"
        >
          {{ title }}
        </MenuButton>
      </li>
    </ul>
    <PageCreation v-if="whatPageIsShown === 'page-creation'" />
    <PagesList v-if="whatPageIsShown === 'pages-list'" />
    <LinksList v-if="whatPageIsShown === 'links-list'" :is-in-admin-page="true" />
    <NewsForm v-if="whatPageIsShown === 'add-news'" :is-in-popup="false" />
    <ConfForm v-if="whatPageIsShown === 'add-conf'" :is-in-popup="false" />
    <FileLoadForm v-if="whatPageIsShown === 'download-file'" />
    <FilesList v-if="whatPageIsShown === 'files-list'" />
  </main>
</template>

<style lang="scss">
.admin {
  max-width: 1400px;
  width: 100%;
  display: flex;
  margin: 0 auto;
  gap: 50px;
  padding-block: 40px 60px;

  .admin__menu {
    margin-left: 20px;

    li:not(:last-of-type) {
      margin-bottom: 10px;
    }
  }
}
</style>
