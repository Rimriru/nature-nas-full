<script setup lang="ts">
const news = useNewsState();
const reversedNews = computed(() => news.value.slice(0, 15).reverse());
</script>

<template>
  <main class="main">
    <p class="title">Ты на главной!</p>
    <div class="links">
      <NuxtLink to="/admin">To admin</NuxtLink>
      <NuxtLink to="/look">To Canvas One</NuxtLink>
    </div>
    <section aria-label="Новости">
      <h2 class="news-title">Новости</h2>
      <UCarousel
        v-slot="{ item }"
        :items="reversedNews"
        :ui="{ item: 'basis-full md:basis-1/2 lg:basis-1/3 justify-evenly' }"
        :prev-button="{
          color: 'blue',
          icon: 'i-heroicons-arrow-left-20-solid',
          class: '-left-12'
        }"
        :next-button="{
          color: 'blue',
          icon: 'i-heroicons-arrow-right-20-solid',
          class: '-right-12'
        }"
        arrows
      >
        <NewsCardSmall :news-item="item" :draggable="false" />
      </UCarousel>
    </section>
  </main>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

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

.news-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.8;
  text-align: center;
  color: #fff;
  background-color: $mid-blue;
  border-radius: 60px;
  margin-bottom: 40px;
}
</style>
