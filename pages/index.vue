<script setup lang="ts">
import type Slide from '~/types/SlideDataFromDb';

const isSlideFormOpen = ref(false);
const slideItemOfInterest = ref<Slide | ''>('');

const news = useNewsState();
const reversedNews = computed(() => news.value.slice(0, 15).reverse());

const slides = await useHomeSlides();
const slidesState = useHomeSlidesState();

slidesState.value = slides;
const firstHomeSliderItems = computed(() =>
  slidesState.value.filter((slide) => slide.placement === 'home-1')
);

const onEditSlideBtnClick = (slideItem: Slide) => {
  isSlideFormOpen.value = true;
  slideItemOfInterest.value = slideItem;
};

const onSlideFormClose = () => {
  isSlideFormOpen.value = false;
  slideItemOfInterest.value = '';
};
</script>

<template>
  <main class="home">
    <p class="title">Ты на главной!</p>
    <div class="links">
      <NuxtLink to="/admin">To admin</NuxtLink>
      <NuxtLink to="/look">To Canvas One</NuxtLink>
    </div>
    <section class="main-news" aria-label="Новости">
      <h2 class="news-title">Новости</h2>
      <UCarousel
        v-slot="{ item }"
        class="main-news__carousel"
        :items="reversedNews"
        :ui="{ item: 'basis-full md:basis-1/2 lg:basis-1/3 justify-evenly' }"
        :prev-button="{
          color: 'blue',
          icon: 'i-heroicons-arrow-left-20-solid',
          class: '-left-12 lg:-left-5 md:left-3'
        }"
        :next-button="{
          color: 'blue',
          icon: 'i-heroicons-arrow-right-20-solid',
          class: '-right-12 lg:-right-5 md:right-3'
        }"
        arrows
      >
        <NewsCardSmall :news-item="item" :draggable="false" />
      </UCarousel>
      <div class="research">
        <h1 class="research__title">Институт выполняет исследования по следующим направлениям:</h1>
        <ul class="research__list">
          <li>разработка научных основ природопользования и охраны окружающей среды;</li>
          <li>
            оценка, прогнозирование и оптимизация антропогенных воздействий на природные комплексы;
          </li>
          <li>
            научное обоснование создания ресурсосберегающих технологий добычи, переработки и
            использования твердых горючих ископаемых;
          </li>
          <li>
            изучение условий формирования и оценка состояния пресных питьевых и минеральных вод;
          </li>
          <li>
            изучение геодинамики земной коры и современных геологических процессов на территории
            Беларуси;
          </li>
          <li>
            геоэкологическое обоснование проектирования и размещения особо ответственных сооружений
            и экологоопасных объектов (АЭС, ГЭС, подземных хранилищ газа, мест захоронения
            высокотоксичных отходов и др.);
          </li>
          <li>
            диагностика состояния природной среды на основе использования современных
            аэрокосмических, наземных, телекоммуникационных и информационно-измерительных средств;
          </li>
          <li>
            изучение глобального и регионального климата и его изменений под влиянием естественных и
            антропогенных факторов; прогнозирование изменений климата и их последствий.
          </li>
        </ul>
      </div>
    </section>
    <HomeSlider :items="firstHomeSliderItems" @edit-click="onEditSlideBtnClick" />
    <LazySlideForm
      :is-open="isSlideFormOpen"
      :slide-data="slideItemOfInterest"
      @on-close="onSlideFormClose"
    />
  </main>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.home {
  padding-block: 40px 80px;
}

.title {
  font-size: 19px;
  text-align: center;
  margin-bottom: 5px;
}
.links {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.main-news {
  max-width: 1100px;
  margin: 0 auto;

  .main-news__carousel {
    max-width: 1000px;
    margin: 0 auto;
    margin-bottom: 30px;
  }
}

.news-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.8;
  text-align: center;
  color: #fff;
  background-color: $mid-blue;
  border-radius: 60px;
  margin-bottom: 40px;
  width: 100%;
}

.research {
  margin-bottom: 60px;
  width: calc(100% - 40px * 2);
  margin: 0 40px 60px;

  .research__title {
    color: $mid-blue;
    font-size: 18px;
    line-height: 1.1;
    font-weight: 500;
    margin-bottom: 12px;
  }

  .research__list {
    list-style: disc;
    font-size: clamp(0.9rem, 1.5vw, 1rem);
  }
}
</style>
