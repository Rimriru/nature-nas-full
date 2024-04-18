<script setup lang="ts">
import { ADMIN_PAGES } from '~/utils/linksData';

const whatPageIsShown = ref('page-creation');

const handleMenuButtonClick = (pageId: string) => {
  whatPageIsShown.value = pageId;
};

useServerSeoMeta({
  robots: 'none noarchive nositelinkssearchbox'
});
</script>

<template>
  <main class="admin">
    <ul>
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
    <NewsCreation v-if="whatPageIsShown === 'add-news'" />
  </main>
</template>

<style lang="scss">
.admin {
  max-width: 1400px;
  width: 100%;
  display: flex;
  margin: 0 auto;
  gap: 50px;
  padding-block: 40px;

  ul li:not(:last-of-type) {
    margin-bottom: 10px;
  }
}
</style>
~/utils/linksData
