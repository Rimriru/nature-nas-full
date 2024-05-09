<script setup lang="ts">
const contactsState = useContactsState();
const contacts = computed(() => {
  if (contactsState.value) {
    const { address, telNumber, faxNumber, email } = contactsState.value;
    return { address, telNumber, faxNumber, email };
  }
});

const isContactsFormPopupOpen = ref(false);

const onEditBtnClick = () => {
  isContactsFormPopupOpen.value = true;
};

const onContactsFormClose = () => {
  isContactsFormPopupOpen.value = false;
};

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
        width="560"
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
            Почтовый адрес: {{ contacts?.address }}
          </li>
          <li>
            <UIcon class="w-6 h-6 self-center" name="i-material-symbols-phone-enabled-outline" />
            Тел.: {{ contacts?.telNumber }}
          </li>
          <li>
            <UIcon class="w-6 h-6 self-center" name="i-material-symbols-fax-outline" />
            Тел./факс: {{ contacts?.faxNumber }}
          </li>
          <li>
            <UIcon class="w-6 h-6 self-center" name="i-material-symbols-mail-outline" />
            Email: {{ contacts?.email }}
          </li>
        </ul>
      </div>
      <ClientOnly>
        <EditBtn :color="'black'" class="contacts__edit-btn" @click="onEditBtnClick" />
      </ClientOnly>
    </section>
    <LazyContactsForm :is-open="isContactsFormPopupOpen" @close="onContactsFormClose" />
  </main>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.contacts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 30px;
  padding: 30px;
  max-width: 1140px;
  margin: 0 auto;
  position: relative;

  .contacts__map {
    border: 1px solid black;
    border-radius: 10px;
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
</style>
