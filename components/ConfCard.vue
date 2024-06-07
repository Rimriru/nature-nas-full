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
      :src="
        coverAsSrc
          ? confItem.cover
          : `${$config.public.process === 'production' ? '' : $config.public.domen}/image/${
              confItem.cover
            }`
      "
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
@import url('~/assets/styles/components/confCard.scss');
</style>
