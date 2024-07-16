<script setup lang="ts">
import type { IMonograph } from '~/types/MgraphsDataFromDb';
const props = defineProps<{
  item: IMonograph;
}>();

const coverAsSrc = computed(() => IMAGE_LINK_REG_EXP.test(props.item.cover));
</script>

<template>
  <article class="monograph">
    <img
      :src="
        coverAsSrc
          ? item.cover
          : `${$config.public.process === 'production' ? '' : $config.public.domen}/image/${
              item.cover
            }`
      "
      class="monograph__cover"
      alt="Обложка монографии"
      loading="lazy"
    />
    <div>
      <h2 class="monograph__title">{{ item.title }}</h2>
      <p class="monograph__year">Год выпуска: {{ item.year }}</p>
      <p class="monograph__description">{{ item.description }}</p>
    </div>
    <div class="monograph__btn-container">
      <EditBtn :color="'black'" />
      <RemoveBtn />
    </div>
  </article>
</template>

<style lang="scss">
.monograph {
  display: flex;
  gap: 50px;
  position: relative;

  .monograph__cover {
    width: 250px;
    height: 310px;
    object-position: center;
    border-radius: 10px;
  }

  .monograph__title {
    color: rgb(60, 81, 180);
    font-size: clamp(16px, 1.5vw, 18px);
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 8px;
  }

  .monograph__year {
    font-size: clamp(14px, 1.5vw, 16px);
    font-weight: 300;
    margin-bottom: 10px;
  }

  .monograph__description {
    font-size: clamp(14px, 2.5vw, 16px);
  }

  .monograph__btn-container {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    gap: 10px;
  }
}
</style>
