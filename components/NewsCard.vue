<script setup lang="ts">
import newsPreview from '~/assets/images/news-preview-default.jpg';
import type { NewsCardData } from '~/types/NewsDataFromDb';

const props = defineProps<{
  newsItem: NewsCardData;
}>();

const config = useRuntimeConfig();

const coverAsSrc = /^(http|https):\/\/[^\s/$.?#].[^\s]*$/.test(props.newsItem.cover);
</script>

<template>
  <article class="news-card">
    <img
      class="news-card__cover"
      :src="coverAsSrc ? newsItem.cover : `${config.public.domen}/image/${newsItem.cover}`"
      alt="Обложка новости"
    />
    <div class="news-card__info-block">
      <h2 class="news-card__title">{{ newsItem.title }}</h2>
      <p class="news-card__date">{{ newsItem.date }}</p>
      <p class="news-card__description">
        {{ newsItem.description }}
      </p>
    </div>
    <NuxtLink :to="`/news/${newsItem._id}`" class="news-card__btn">
      <p class="news-card__btn-text">Подробнее</p>
      <p class="news-card__btn-arrow">
        <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
            fill="black"
          ></path>
        </svg>
      </p>
    </NuxtLink>
  </article>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.news-card {
  max-width: 1110px;
  display: grid;
  grid-template-columns: 310px auto 150px;
  grid-template-rows: 200px;
  column-gap: 30px;
  overflow-y: hidden;
  padding-bottom: 50px;

  .news-card__cover {
    width: 308px;
    height: 200px;
    object-fit: cover;
    object-position: center;
    border-radius: 5px;
  }

  .news-card__title {
    color: $mid-blue;
    font-size: clamp(16px, 1.5vw, 18px);
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 10px;
  }

  .news-card__date {
    color: $mid-blue;
    margin-bottom: 15px;
  }

  .news-card__description {
    max-width: 560px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .news-card__btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 3px 7px 3px 10px;
    border-radius: 10px;
    border: none;
    overflow: hidden;
    background: transparent;
    color: $black;
    align-self: end;
    border: $mid-blue 1px solid;
    cursor: pointer;

    &:hover {
      .news-card__btn-text {
        transform: translateX(0px);
      }

      .news-card__btn-arrow {
        transform: translateY(0px);
      }
    }

    .news-card__btn-text {
      transform: translateX(20px);
      font-size: 1rem;
      font-weight: 600;
      transition-duration: 0.3s;
    }

    .news-card__btn-arrow {
      transform: translateY(35px);
      transition-duration: 0.3s;
    }
  }
}
</style>
