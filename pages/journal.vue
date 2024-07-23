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

const { width } = useWindowSize();

const publications = computed(() => {
  const menuItems = filesState.value
    .filter((file) => file.category && file.category === 'nature-journal')
    .map((item) => {
      return {
        label: item.name,
        to: `${
          config.public.process === 'production' ? config.public.prodDomen : config.public.devDomen
        }/file/${item.file}`
      };
    })
    .sort((a, b) => b.label.localeCompare(a.label));

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
  <main class="journal">
    <aside class="journal__aside">
      <div class="journal__info">
        <img
          :src="IMAGE_LINK_REG_EXP.test(journalState?.cover!) ? `${journalState?.cover}` : `/image/${journalState?.cover}`"
          class="journal__cover"
          alt="Обложка журнала"
          loading="lazy"
        />
        <div class="journal__info-container">
          <NuxtLink
            :to="`/file/${journalState?.authorRules.file}`"
            :external="true"
            class="button-border"
            target="_blank"
            >Правила для авторов</NuxtLink
          >
          <NuxtLink
            :to="`/file/${journalState?.editorialPolicy.file}`"
            :external="true"
            class="button-border"
            target="_blank"
            >Редакционная политика</NuxtLink
          >
          <UDropdown
            :items="publications"
            mode="hover"
            :popper="{
              placement: `${width < 800 ? 'bottom-start' : 'right-start'}`,
              scroll: true,
              adaptive: true,
              resize: true
            }"
            :ui="{
              width: 'w-auto',
              height: 'max-h-96',
              wrapper: 'w-full'
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
            <template #item="{ item }">
              <NuxtLink class="journal__menu-item" :to="item.to" target="_blank">{{
                item.label
              }}</NuxtLink>
            </template>
          </UDropdown>
        </div>
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
    <LazyFileLoadFormPopup
      :is-open="isFileLoadFormPopupOpen"
      :is-uploading-jurnal-issue="true"
      @close="onFileLoadFormPopupClose"
    />
  </main>
</template>

<style lang="scss">
@import url('~/assets/styles/pages/journal.scss');
</style>
