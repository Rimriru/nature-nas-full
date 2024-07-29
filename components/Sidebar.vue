<script setup lang="ts">
// Компонент бокового меню с ссылками
import type { Link } from '~/types/LinkDataFromDb';
const props = defineProps<{
  links?: SidebarLink[];
  isForMonographs: boolean;
  isIconPresent: boolean;
  parentRoute: string;
}>();

const emit = defineEmits([
  'onAddLinkButtonClick',
  'onEditLinkButtonClick',
  'onRemoveLinkButtonClick'
]);

const isLoggedIn = useLoggedInState();
</script>

<template>
  <aside class="sidebar">
    <ul>
      <li v-for="{ _id: id, title, to, linkMgraphs } of links" :key="id" class="sidebar__item">
        <NuxtLink :to="`/${parentRoute}${to}`" class="sidebar__link">
          <UIcon
            v-if="isForMonographs && isIconPresent && $route.fullPath === `/monographs${to}`"
            name="i-material-symbols-book-2-outline-rounded"
          />
          <p class="sidebar__link-text">
            {{ title }}
          </p></NuxtLink
        >
        <div v-if="isLoggedIn" class="sidebar__btn-container">
          <EditBtn :color="'black'" @click="emit('onEditLinkButtonClick', id, title, to)" />
          <RemoveBtn
            :disabled="typeof linkMgraphs === 'number' && linkMgraphs !== 0"
            :class="{ 'sidebar__remove-btn': typeof linkMgraphs === 'number' && linkMgraphs !== 0 }"
            @click="emit('onRemoveLinkButtonClick', id, title, to)"
          />
        </div>
      </li>
    </ul>
    <AddLinkButton :color="'mid-blue'" :size="'sm'" @click="emit('onAddLinkButtonClick')" />
  </aside>
</template>

<style lang="scss">
@import url('~/assets/styles/components/sidebar.scss');
</style>
