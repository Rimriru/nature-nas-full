<script setup lang="ts">
const personaName = ref('Виталий Владимирович Жоб');
const personaPhoneNumber = ref('+7534534543');
const personaFaxNumber = ref('+04543545');
const personaEmail = ref('щкщкщ');
const personaDescription = ref('Я полон сил и энергичен');
const personaPhoto = ref('/add-photo.png');
</script>

<template>
  <div class="persona-card">
    <div class="persona-card__main-block">
      <NuxtImg :src="personaPhoto" />
      <div class="persona-card__info">
        <h2>{{ personaName }}</h2>
        <p>
          <UIcon name="i-material-symbols-phone-enabled-outline" />
          Тел. {{ personaPhoneNumber }}
        </p>
        <p>
          <UIcon name="i-material-symbols-fax-outline" />
          Тел./факс: {{ personaFaxNumber }}
        </p>
        <p>
          <UIcon name="i-material-symbols-mail-outline" />
          Email: {{ personaEmail }}
        </p>
      </div>
    </div>
    <p class="persona-card__description">{{ personaDescription }}</p>
  </div>
</template>

<style lang="scss">
@import url('~/assets/styles/components/personaCard.scss');
</style>
