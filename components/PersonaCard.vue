<script setup lang="ts">
const props = defineProps(['personaData', 'isReversed']);

const config = useRuntimeConfig();
</script>

<template>
  <div class="persona-card">
    <div
      :class="[
        'persona-card__main-block',
        { 'persona-card__main-block_reversed': props.isReversed }
      ]"
    >
      <NuxtImg
        v-if="props.personaData.photo"
        :src="`${config.public.domen}/image/${props.personaData.photo}`"
      />
      <div class="persona-card__info">
        <h2>{{ props.personaData.position }}</h2>
        <h3>{{ props.personaData.name }}</h3>
        <p>{{ props.personaData.phd }}</p>
        <p v-if="props.personaData.telNumber">
          <UIcon name="i-material-symbols-phone-enabled-outline" />
          Тел.: {{ props.personaData.telNumber }}
        </p>
        <p v-if="props.personaData.faxNumber">
          <UIcon name="i-material-symbols-fax-outline" />
          Тел./факс: {{ props.personaData.faxNumber }}
        </p>
        <p v-if="props.personaData.email">
          <UIcon name="i-material-symbols-mail-outline" />
          Email:
          <a class="persona-card__email-link" :href="`mailto:${props.personaData.email}`">{{
            props.personaData.email
          }}</a>
        </p>
      </div>
    </div>
    <p v-if="props.personaData.description" class="persona-card__description">
      {{ props.personaData.description }}
    </p>
  </div>
</template>

<style lang="scss">
@import url('~/assets/styles/components/personaCard.scss');
</style>
