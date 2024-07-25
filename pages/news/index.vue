<script setup lang="ts">
import type { NewsDataFromDb } from '~/types/NewsDataFromDb';

const title = 'Новости';
const newsState = useNewsState();

const page = ref(1);
const pageCount = ref(5);
const isNewsFormPopupOpen = ref(false);
const newsItemOfInterest = ref<NewsDataFromDb | ''>('');
const newsItemTitleForRemove = ref('');
const isConfirmPopupOpen = ref(false);
const removeRequestError = ref('');
const isNewsItemRemoveRequestPending = ref(false);
const notifications = useToast();

provide('newsItem', newsItemOfInterest);

useSeoMeta({
  title
});

definePageMeta({
  title: 'Новости'
});

const indexes = computed(() => {
  const firstIndex = (page.value - 1) * pageCount.value;
  const lastIndex = firstIndex + pageCount.value;
  return { firstIndex, lastIndex };
});
const newsItemsPerPage = computed(() => {
  const reversedNews = newsState.value.slice().reverse();
  return reversedNews.slice(indexes.value.firstIndex, indexes.value.lastIndex);
});

watch(page, () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
});

const resetNewsItemOfInterest = () => {
  newsItemOfInterest.value = '';
};

const onEditBtnClick = (newsItem: NewsDataFromDb) => {
  isNewsFormPopupOpen.value = true;
  newsItemOfInterest.value = newsItem;
};

const onNewsFormClose = () => {
  isNewsFormPopupOpen.value = false;
  resetNewsItemOfInterest();
};

const onNewsItemRemoveBtnClick = (newsItem: NewsDataFromDb) => {
  newsItemOfInterest.value = newsItem;
  newsItemTitleForRemove.value = newsItem.title;
  isConfirmPopupOpen.value = true;
};

const onConfirmPopupClose = () => {
  isConfirmPopupOpen.value = false;
  resetNewsItemOfInterest();
  newsItemTitleForRemove.value = '';
  isNewsItemRemoveRequestPending.value = false;
};

const handleNewsItemRemove = async () => {
  isNewsItemRemoveRequestPending.value = true;
  try {
    await $fetch(`/api/news/${(newsItemOfInterest.value as NewsDataFromDb)._id}`, {
      method: 'delete'
    });

    newsState.value = newsState.value.filter(
      (item) => item._id !== (newsItemOfInterest.value as NewsDataFromDb)._id
    );
    notifications.add({
      id: 'news',
      title: `Новость "${(newsItemOfInterest.value as NewsDataFromDb).title}" была удалена`
    });
    onConfirmPopupClose();
  } catch (error: any) {
    isNewsItemRemoveRequestPending.value = false;
    removeRequestError.value = `${error.statusCode}: ${error.data.message}`;
  }
};
</script>

<template>
  <main class="news">
    <ul class="shadow-border news__list">
      <li v-for="item of newsItemsPerPage" :key="item._id" class="news__item">
        <NewsCard
          :news-item="item"
          @edit-click="onEditBtnClick"
          @remove-click="onNewsItemRemoveBtnClick"
        />
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
    <ClientOnly>
      <LazyNewsFormPopup :is-open="isNewsFormPopupOpen" @on-close="onNewsFormClose" />
      <LazyConfirmPopup
        :is-open="isConfirmPopupOpen"
        :what-is-removed="'newsItem'"
        :removed-item-title="newsItemTitleForRemove"
        :is-request-pending="isNewsItemRemoveRequestPending"
        :error="removeRequestError"
        @on-close="onConfirmPopupClose"
        @on-agree="handleNewsItemRemove"
      />
    </ClientOnly>
  </main>
</template>

<style lang="scss">
@import url('~/assets/styles/pages/news.scss');
</style>
