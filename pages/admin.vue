<script setup lang="ts">
import { ADMIN_PAGES } from '~/utils/linksData';

const whatPageIsShown = ref('page-creation');

const handleMenuButtonClick = (pageId: string) => {
  whatPageIsShown.value = pageId;
};
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
    <UNotifications />
  </main>
</template>

<style lang="scss">
@import url('../assets/styles/base.css');
.admin {
  max-width: 1400px;
  display: flex;
  margin: 0 auto;
  gap: 50px;
  padding-block: 50px;

  ul li:not(:last-of-type) {
    margin-bottom: 10px;
  }
}
</style>
~/utils/linksData
