<script setup lang="ts">
import type { IMonograph } from '~/types/MgraphsDataFromDb';
const props = defineProps<{
  item: IMonograph;
}>();

const emit = defineEmits(['onEditClick', 'onRemoveClick']);

const isLoggedIn = useLoggedInState();

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
      :alt="item.title"
      loading="lazy"
    />
    <div class="monograph__info">
      <h2 class="monograph__title">{{ item.title }}</h2>
      <p class="monograph__year">Год выпуска: {{ item.year }}</p>
      <p class="monograph__description">{{ item.description }}</p>
    </div>
    <div v-if="isLoggedIn" class="monograph__btn-container">
      <EditBtn :color="'black'" @click="emit('onEditClick', item)" />
      <RemoveBtn @click="emit('onRemoveClick', item)" />
    </div>
  </article>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.monograph {
  display: flex;
  gap: 50px;
  position: relative;

  .monograph__cover {
    width: 250px;
    height: 353px;
    object-position: center;
    object-fit: cover;
    flex-shrink: 0;
    border-radius: 10px;
  }

  .monograph__info {
    .monograph__title {
      color: $mid-blue;
      font-size: clamp(16px, 1.5vw, 18px);
      font-weight: 600;
      line-height: 1.2;
      margin-bottom: 8px;
    }

    .monograph__year {
      color: $mid-blue;
      font-size: clamp(14px, 1.5vw, 16px);
      margin-bottom: 10px;
    }

    .monograph__description {
      font-size: clamp(14px, 2.5vw, 16px);
    }
  }

  .monograph__btn-container {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    gap: 10px;
  }
}

@media screen and (max-width: 900px) {
  .monograph {
    flex-direction: column;
    row-gap: 10px;

    .monograph__cover {
      margin: 0 auto;
    }
  }
}
</style>
