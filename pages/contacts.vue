<script setup lang="ts">
const contactsState = useContactsState();
const contactsWithIcons = computed(() => {
  const array = [];
  for (const item in contactsState.value) {
    array.push({
      icon: contactsData[item],
      item
    });
  }
  return array;
});
</script>

<template>
  <main class="main">
    <section class="shadow-border contacts" aria-label="Контакты">
      <iframe
        title="Интерактивная карта"
        width="560"
        height="400"
        frameborder="1"
        allowfullscreen="true"
        src="https://yandex.ru/map-widget/v1/?um=constructor%3A9782b7cb08c1da3b391d3b761d68c22243167792b189267c57ddf83a6d54c8b3&source=constructor"
        class="contacts__map"
      ></iframe>
      <div>
        <h1 class="contacts__title">Контакты</h1>
        {{ contactsWithIcons }}
        <ul>
          <li v-for="item of contactsState">{{ item }}</li>
        </ul>
      </div>
    </section>
  </main>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.contacts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 40px;
  padding: 30px;

  .contacts__map {
    border: 1px solid black;
    border-radius: 10px;
  }

  .contacts__title {
    font-size: 22px;
    text-align: center;
    font-weight: 500;
    color: $mid-blue;
    margin-bottom: 10px;
  }
}
</style>
