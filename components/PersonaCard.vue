<script setup lang="ts">
const props = defineProps(['personaData']);
// const personaName = ref('Виталий Владимирович Жоб');
// const personaPhoneNumber = ref('+7534534543');
// const personaFaxNumber = ref('+04543545');
// const personaEmail = ref('щкщкщ');
// const personaDescription = ref('Я полон сил и энергичен');
const personaPhoto = ref('/add-photo.png');

watch(
  () => props.personaData,
  (newValue) => {
    console.log(newValue);
  }
);
</script>

<template>
  <div class="persona-card">
    <div class="persona-card__main-block">
      <NuxtImg :src="personaPhoto" />
      <div class="persona-card__info">
        <h2>{{ props.personaData.name }}</h2>
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
          Email: {{ props.personaData.email }}
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
