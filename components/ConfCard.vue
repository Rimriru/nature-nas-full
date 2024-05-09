<script setup lang="ts">
import type { ConfDataFromDb } from '~/types/ConfsDataFromDb';

const props = defineProps<{
  confItem: ConfDataFromDb;
}>();

const emit = defineEmits(['editClick', 'removeClick']);

const coverAsSrc = computed(() => IMAGE_LINK_REG_EXP.test(props.confItem.cover));

const date = (date: string) =>
  new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
</script>

<template>
  <article class="shadow-border conf-card">
    <img
      class="conf-card__cover"
      :src="coverAsSrc ? confItem.cover : `${$config.public.domen}/image/${confItem.cover}`"
      alt="Обложка новости"
    />
    <div class="conf-card__main-block">
      <p class="conf-card__date">
        {{
          confItem.endDate
            ? `${date(confItem.startDate)} – ${date(confItem.endDate)}`
            : `${date(confItem.startDate)}`
        }}
      </p>
      <p class="conf-card__description">{{ confItem.description }}</p>
      <AnimatedLinkContent
        :to="`/conferences/${confItem._id}`"
        :text="'Подробнее'"
        :direction="'right'"
        class="conf-card__link"
      />
      <ClientOnly>
        <div class="conf-card__management">
          <EditBtn :color="'black'" @click="emit('editClick', confItem)" />
          <RemoveBtn @click="emit('removeClick', confItem)" />
        </div>
      </ClientOnly>
    </div>
  </article>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.conf-card {
  width: 300px;
  height: 400px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .conf-card__cover {
    width: 100%;
    height: 200px;
  }

  .conf-card__main-block {
    display: grid;
    padding: 10px 25px;
    flex-grow: 1;
    position: relative;

    .conf-card__date {
      color: $mid-blue;
      font-weight: 500;
      margin-bottom: 20px;
    }

    .conf-card__description {
      font-size: 15px;
      height: 100px;
      overflow-y: auto;
      padding-right: 0;
    }

    .conf-card__link {
      border: none;
      justify-self: left;
    }

    .conf-card__management {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
}
</style>
