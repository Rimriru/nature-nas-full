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

const config = useRuntimeConfig();

const publications = computed(() => {
  const menuItems = journalState.value?.publications?.map((item) => {
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
</script>

<template>
  <section class="journal">
    <aside class="journal__aside">
      <div class="journal__info">
        <img :src="`${$config.public.domen}/image/${journalState?.cover}`" class="journal__cover" />
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
          :popper="{ placement: 'auto', scroll: true, adaptive: true }"
        >
          <UButton
            color="white"
            trailing-icon="i-heroicons-chevron-down-20-solid"
            class="button-border"
            >Публикации</UButton
          >
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
    </aside>
    <section class="journal__text-block">
      <article class="shadow-border journal__description">
        <div v-html="journalState?.description"></div>
      </article>
      <div class="journal__people">
        <div class="journal__inst-people">
          <article>
            <h2 class="people-title">ГЛАВНЫЙ РЕДАКТОР</h2>
            <div v-html="journalState?.editChief"></div>
          </article>
          <article>
            <h2 class="people-title">РЕДАКЦИОННАЯ КОЛЛЕГИЯ</h2>
            <div v-html="journalState?.editBoard"></div>
          </article>
        </div>
        <article>
          <h2 class="people-title">МЕЖДУНАРОДНЫЙ РЕДАКЦИОННЫЙ СОВЕТ</h2>
          <div v-html="journalState?.editInternatBoard"></div>
        </article>
      </div>
    </section>
  </section>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.button-border {
  padding: 5px 5px;
  width: clamp(150px, 20vw, 250px);
  border: $mid-blue 2px solid;
  border-radius: 5px;
  text-align: center;
  justify-content: center;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.6;
}

.people-title {
  font-size: 20px;
  font-weight: 600;
  color: $mid-blue;
}

.journal {
  display: flex;
  gap: 60px;
  width: clamp(400px, 75vw, 1300px);
  margin: 0 auto;
  padding-block: 40px 80px;

  .journal__aside {
    display: grid;
    gap: 30px;
    justify-items: center;

    .journal__info {
      display: grid;
      gap: 10px;
      justify-items: center;

      .journal__cover {
        width: 300px;
        height: 400px;
        //object-fit: cover;
        border-radius: 10px;
      }

      .journal__menu-item {
        font-size: 17px;
        color: black;
      }
    }

    .journal__contacts-title {
      color: $mid-blue;
      font-size: 20px;
      font-weight: 500;
      text-align: center;
      margin-bottom: 10px;
    }

    .journal__contacts-text {
      display: flex;
      gap: 10px;
    }
  }

  .journal__text-block {
    flex-grow: 1;

    .journal__description {
      padding: 20px;
      margin-bottom: 30px;
    }

    .journal__people {
      display: flex;
      justify-content: space-between;
      gap: 50px;

      .journal__inst-people {
        display: grid;
        row-gap: 20px;
      }
    }
  }
}
</style>
