<script setup lang="ts">
const ADMIN_PAGES = [
  { id: 'page-creation', title: 'СОЗДАТЬ СТРАНИЦУ' },
  { id: 'pages-list', title: 'СПИСОК СТРАНИЦ' },
  { id: 'add-news', title: 'ДОБАВИТЬ НОВОСТЬ' }
];

const whatPageIsShown = ref('page-creation');

const handleMenuButtonClick = (pageId: string) => {
  whatPageIsShown.value = pageId;
};
</script>

<template>
  <div class="admin">
    <ul>
      <li v-for="({ id, title }, index) in ADMIN_PAGES" :key="index">
        <MenuButton
          :title="title"
          :id="id"
          :what-page-is-shown="whatPageIsShown"
          @click="handleMenuButtonClick(id)"
        />
      </li>
    </ul>
    <PageCreation v-if="whatPageIsShown === 'page-creation'" />
  </div>
</template>

<style lang="scss">
@import url('../assets/styles/base.css');
.admin {
  display: flex;
  margin: 0 auto;
  gap: 80px;

  ul li:not(:last-of-type) {
    margin-bottom: 10px;
  }
}
</style>
