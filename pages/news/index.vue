<script setup lang="ts">
const title = 'Новости';
const pageTitleState = usePageTitle();
const newsState = useNewsState();

pageTitleState.value = title;

const page = ref(1);
const pageCount = ref(5);

useSeoMeta({
  title
});

definePageMeta({
  title: 'Новости'
});

const indexes = computed(() => {
  const firstIndex = (page.value - 1) * pageCount.value;
  const lastIndex = page.value - 1 + pageCount.value;
  return { firstIndex, lastIndex };
});
const newsItemsPerPage = computed(() =>
  newsState.value.slice(indexes.value.firstIndex, indexes.value.lastIndex)
);

watch(page, () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
});
</script>

<template>
  <main class="main">
    <ul class="news">
      <li v-for="item of newsItemsPerPage" :key="item._id" class="news__item">
        <NewsCard :news-item="item" />
      </li>
    </ul>
    <UPagination
      class="pagination"
      v-if="newsState"
      v-model="page"
      :page-count="pageCount"
      :total="newsState.length"
      :max="7"
      size="md"
      show-last
      show-first
      :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Пред', color: 'gray' }"
      :next-button="{
        icon: 'i-heroicons-arrow-small-right-20-solid',
        trailing: true,
        label: 'След',
        color: 'gray'
      }"
    />
  </main>
</template>

<style lang="scss">
.news {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 50px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  border-radius: 20px;
  padding: 40px 40px 0;

  .news__item {
    &:not(:last-child) {
      border-bottom: rgba(122, 119, 119, 0.4) 1px solid;
    }
  }
}

.pagination {
  margin-top: 30px;
  justify-content: center;
}
</style>
