<script setup lang="ts">
const contactsState = useContactsState();
console.log(contactsState.value);

const isContactsFormPopupOpen = ref(false);

const onEditBtnClick = () => {
  isContactsFormPopupOpen.value = true;
};

const onContactsFormClose = () => {
  isContactsFormPopupOpen.value = false;
};

console.log(contactsState.value?.content);

const title = 'Контакты';
useSeoMeta({
  title
});

definePageMeta({
  title: 'Контакты'
});
</script>

<template>
  <main class="main">
    <section class="shadow-border contacts" aria-label="Контакты">
      <iframe
        title="Интерактивная карта"
        height="400"
        frameborder="1"
        allowfullscreen="true"
        src="https://yandex.ru/map-widget/v1/?um=constructor%3A9782b7cb08c1da3b391d3b761d68c22243167792b189267c57ddf83a6d54c8b3&source=constructor"
        class="contacts__map"
      ></iframe>
      <div>
        <h1 class="contacts__title">Контакты</h1>
        <ul class="contacts__list">
          <li>
            <UIcon class="w-6 h-6 self-center" name="i-material-symbols-location-on-outline" />
            Почтовый адрес: {{ contactsState?.address }}
          </li>
          <li>
            <UIcon class="w-6 h-6 self-center" name="i-material-symbols-phone-enabled-outline" />
            Тел.: {{ contactsState?.telNumber }}
          </li>
          <li>
            <UIcon class="w-6 h-6 self-center" name="i-material-symbols-fax-outline" />
            Тел./факс: {{ contactsState?.faxNumber }}
          </li>
          <li>
            <UIcon class="w-6 h-6 self-center" name="i-material-symbols-mail-outline" />
            Email: {{ contactsState?.email }}
          </li>
        </ul>
      </div>
      <ClientOnly>
        <EditBtn :color="'black'" class="contacts__edit-btn" @click="onEditBtnClick" />
      </ClientOnly>
    </section>
    <div class="content contacts__content" v-html="contactsState?.content"></div>
    <ClientOnly>
      <LazyContactsForm :is-open="isContactsFormPopupOpen" @close="onContactsFormClose" />
    </ClientOnly>
  </main>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.contacts {
  display: grid;
  grid-template-columns: minmax(400px, 560px) minmax(200px, 350px);
  column-gap: 5%;
  padding: 30px;
  max-width: 1400px;
  width: calc(100% - 90px * 2);
  margin: 40px auto 0;
  position: relative;
  justify-content: center;

  .contacts__map {
    border: 1px solid black;
    border-radius: 10px;
    max-width: 560px;
    width: 100%;
  }

  .contacts__title {
    font-size: 22px;
    text-align: center;
    font-weight: 500;
    color: $mid-blue;
    margin-bottom: 15px;
  }

  .contacts__list {
    font-size: 17px;
    display: grid;
    row-gap: 20px;

    li {
      display: grid;
      grid-template-columns: auto 1fr;
      column-gap: 15px;
    }
  }

  .contacts__edit-btn {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}

.contacts__content {
  max-width: 1400px;
  width: calc(100% - 90px * 2);
  margin: 40px auto 0;
}
</style>
