<script setup lang="ts">
import type Slide from '~/types/SlideDataFromDb';

const isSlideFormOpen = ref(false);
const slideItemOfInterest = ref<Slide | ''>('');

const isHomeInfoFormOpen = ref(false);

const news = useNewsState();
const reversedNews = computed(() => (news.value ? news.value.slice(0, 15).reverse() : news.value));

const slides = await useHomeSlides();
const slidesState = useHomeSlidesState();
slidesState.value = slides;

const { width } = useWindowSize();

const homeInfoFromDb = await useHomeInfo();
const homeInfoState = useHomeInfoState();
homeInfoState.value = homeInfoFromDb;

const isLoggedIn = useLoggedInState();

const firstHomeSliderItems = computed(() =>
  slidesState.value.filter((slide) => slide.placement === 'home-1')
);
const secondHomeSliderItems = computed(() =>
  slidesState.value.filter((slide) => slide.placement === 'home-2')
);

const onEditSlideBtnClick = (slideItem: Slide) => {
  isSlideFormOpen.value = true;
  slideItemOfInterest.value = slideItem;
};

const onSlideFormClose = () => {
  isSlideFormOpen.value = false;
  slideItemOfInterest.value = '';
};

const onEditHomeInfoBtnClick = () => {
  isHomeInfoFormOpen.value = true;
};

const onHomeInfoFormClose = () => {
  isHomeInfoFormOpen.value = false;
};
</script>

<template>
  <main class="home">
    <section class="main-news" aria-label="Новости">
      <h2 class="news-title">Новости</h2>
      <ClientOnly>
        <UCarousel
          v-slot="{ item }"
          v-if="reversedNews.length"
          class="main-news__carousel"
          :items="reversedNews"
          :ui="{
            item: 'basis-full md:basis-1/2 lg:basis-1/3 justify-evenly',
            indicators: {
              wrapper: 'top-[110%]'
            }
          }"
          :prev-button="{
            color: 'blue',
            icon: 'i-heroicons-arrow-left-20-solid',
            class: '-left-12 lg:-left-5 md:left-3 ml-2'
          }"
          :next-button="{
            color: 'blue',
            icon: 'i-heroicons-arrow-right-20-solid',
            class: '-right-12 lg:-right-5 md:right-3 mr-2'
          }"
          :arrows="width >= 800"
          :indicators="width < 800"
        >
          <NewsCardSmall :news-item="item" :draggable="false" />
        </UCarousel>
      </ClientOnly>
      <article class="research">
        <div class="research__content content" v-html="homeInfoState?.content"></div>
        <EditBtn :color="'black'" class="research__edit-btn" @click="onEditHomeInfoBtnClick" />
      </article>
    </section>
    <ClientOnly>
      <HomeSlider
        :items="firstHomeSliderItems"
        :indicators-on="true"
        :with-angled-img="true"
        @edit-click="onEditSlideBtnClick"
      />
      <HomeSlider
        :items="secondHomeSliderItems"
        :indicators-on="false"
        @edit-click="onEditSlideBtnClick"
      />
      <LazySlideForm
        v-if="isLoggedIn"
        :is-open="isSlideFormOpen"
        :slide-data="slideItemOfInterest"
        @on-close="onSlideFormClose"
      />
      <LazyHomeInfoFormPopup
        v-if="isLoggedIn"
        :is-open="isHomeInfoFormOpen"
        @close="onHomeInfoFormClose"
      />
    </ClientOnly>
  </main>
</template>

<style lang="scss">
@import url('~/assets/styles/pages/home.scss');
</style>
