<script setup lang="ts">
const props = defineProps(['personaData', 'isReversed', 'isAlone']);

const emit = defineEmits(['edit-click', 'remove-click']);

const config = useRuntimeConfig();
const loggedInState = useLoggedInState();
</script>

<template>
  <div class="persona-card">
    <div
      :class="[
        'persona-card__main-block',
        {
          'persona-card__main-block_reversed': props.isReversed,
          'persona-card__main-block_alone': props.isAlone
        }
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
        <p v-if="props.personaData.telNumber" class="info-data">
          <UIcon name="i-material-symbols-phone-enabled-outline" />
          Тел.: {{ props.personaData.telNumber }}
        </p>
        <p v-if="props.personaData.faxNumber" class="info-data">
          <UIcon name="i-material-symbols-fax-outline" />
          Тел./факс: {{ props.personaData.faxNumber }}
        </p>
        <p v-if="props.personaData.email" class="info-data">
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
    <ClientOnly>
      <div v-if="isAlone && loggedInState" class="persona-card__management">
        <EditBtn :color="'black'" @click="emit('edit-click', personaData)" />
        <RemoveBtn @click="emit('remove-click', personaData)" />
      </div>
    </ClientOnly>
  </div>
</template>

<style lang="scss">
@import url('~/assets/styles/components/personaCard.scss');
</style>
