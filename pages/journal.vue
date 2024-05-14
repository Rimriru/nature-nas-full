<script setup lang="ts">
const title = 'Журнал "Природопользование"';
useSeoMeta({
  title
});

definePageMeta({
  title: 'Журнал "Природопользование"'
});

const journalState = useJournalState();
const journal = await useJournal();
journalState.value = journal;

const filesState = useFilesState();

const config = useRuntimeConfig();
const isLoggedIn = useLoggedInState();

const isJournalFormPopupOpen = ref(false);
const isFileLoadFormPopupOpen = ref(false);

const publications = computed(() => {
  const menuItems = filesState.value
    .filter((file) => file.category && file.category === 'nature-journal')
    .map((item) => {
      return {
        label: item.name,
        to: `${config.public.domen}/file/${item.file}`,
        external: true,
        target: '_blank',
        labelClass: 'journal__menu-item'
      };
    });

  return [menuItems];
});

const open = ref(false);

defineShortcuts({
  o: () => (open.value = !open.value)
});

const onEditBtnClick = () => {
  isJournalFormPopupOpen.value = true;
};

const onJournalFormPopupClose = () => {
  isJournalFormPopupOpen.value = false;
};

const onLoadIssueBtnClick = () => {
  isFileLoadFormPopupOpen.value = true;
};

const onFileLoadFormPopupClose = () => {
  isFileLoadFormPopupOpen.value = false;
};
</script>

<template>
  <section class="journal">
    <aside class="journal__aside">
      <div class="journal__info">
        <img
          :src="`${$config.public.domen}/image/${journalState?.cover}`"
          class="journal__cover"
          alt="Обложка журнала"
        />
        <NuxtLink
          :to="`${$config.public.domen}/file/${journalState?.authorRules.file}`"
          :external="true"
          class="button-border"
          >Правила для авторов</NuxtLink
        >
        <NuxtLink
          :to="`${$config.public.domen}/file/${journalState?.editorialPolicy.file}`"
          :external="true"
          class="button-border"
          >Редакционная политика</NuxtLink
        >
        <UDropdown
          :items="publications"
          :popper="{ placement: 'right', scroll: true, adaptive: true, resize: true, arrow: true }"
          :ui="{
            width: 'w-auto',
            height: 'max-h-60'
          }"
          v-model:open="open"
        >
          <UButton
            color="white"
            trailing-icon="i-heroicons-chevron-down-20-solid"
            :class="['button-border', 'button', { 'button-active': open }]"
          >
            Публикации
          </UButton>
        </UDropdown>
      </div>
      <div>
        <p class="journal__contacts-title">Контакты редакции:</p>
        <p class="journal__contacts-text">
          <UIcon name="i-material-symbols-location-on-outline" class="w-6 h-6 self-center" />
          {{ journalState?.contacts.address }}
        </p>
        <p class="journal__contacts-text">
          <UIcon name="i-material-symbols-phone-enabled-outline" class="w-6 h-6 self-center" />
          Тел.:
          <a :href="`mailto:${journalState?.contacts.telNumber}`">
            {{ journalState?.contacts.telNumber }}</a
          >
        </p>
        <p class="journal__contacts-text">
          <UIcon name="i-material-symbols-mail-outline" class="w-6 h-6 self-center" />
          Email:
          <a :href="`mailto:${journalState?.contacts.email}`">{{ journalState?.contacts.email }}</a>
        </p>
      </div>
      <div class="journal__btn-container">
        <MenuButton v-if="isLoggedIn" @click="onEditBtnClick">Редактировать</MenuButton>
        <MenuButton v-if="isLoggedIn" @click="onLoadIssueBtnClick">Загрузить выпуск</MenuButton>
      </div>
    </aside>
    <section class="journal__text-block">
      <article class="shadow-border journal__description">
        <div class="content" v-html="journalState?.description"></div>
      </article>
      <div class="journal__people">
        <div class="journal__inst-people">
          <article>
            <h2 class="people-title">ГЛАВНЫЙ РЕДАКТОР</h2>
            <p>{{ journalState?.editChief }}</p>
          </article>
          <article>
            <h2 class="people-title">РЕДАКЦИОННАЯ КОЛЛЕГИЯ</h2>
            <p>{{ journalState?.editBoard }}</p>
          </article>
        </div>
        <article>
          <h2 class="people-title">МЕЖДУНАРОДНЫЙ РЕДАКЦИОННЫЙ СОВЕТ</h2>
          <p>{{ journalState?.editInternatBoard }}</p>
        </article>
      </div>
    </section>
    <LazyJournalFormPopup :is-open="isJournalFormPopupOpen" @close="onJournalFormPopupClose" />
    <LazyFileLoadFormPopup :is-open="isFileLoadFormPopupOpen" @close="onFileLoadFormPopupClose" />
  </section>
</template>

<style lang="scss">
@import url('~/assets/styles/components/journal.scss');
</style>
