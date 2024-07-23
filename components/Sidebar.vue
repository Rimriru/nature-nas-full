<script setup lang="ts">
// Компонент бокового меню с ссылками
import type { Link } from '~/types/LinkDataFromDb';
defineProps<{
  links?: MgraphLink[];
  isIconPresent: boolean;
}>();

const emit = defineEmits([
  'onAddLinkButtonClick',
  'onEditLinkButtonClick',
  'onRemoveLinkButtonClick'
]);

const isLoggedIn = useLoggedInState();

interface MgraphLink extends Link {
  linkMgraphs: number;
}
</script>

<template>
  <aside class="sidebar">
    <ul>
      <li v-for="{ _id: id, title, to, linkMgraphs } of links" :key="id" class="sidebar__item">
        <NuxtLink :to="`/monographs${to}`" class="sidebar__link">
          <UIcon
            v-if="isIconPresent && $route.fullPath === `/monographs${to}`"
            name="i-material-symbols-book-2-outline-rounded"
          />
          <p class="sidebar__link-text">
            {{ title }}
          </p></NuxtLink
        >
        <div v-if="isLoggedIn" class="sidebar__btn-container">
          <EditBtn :color="'black'" @click="emit('onEditLinkButtonClick', id, title, to)" />
          <RemoveBtn
            :disabled="linkMgraphs !== 0"
            :class="{ 'sidebar__remove-btn': linkMgraphs !== 0 }"
            @click="emit('onRemoveLinkButtonClick', id, title, to)"
          />
        </div>
      </li>
    </ul>
    <AddLinkButton :color="'mid-blue'" :size="'sm'" @click="emit('onAddLinkButtonClick')" />
  </aside>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.sidebar {
  flex-basis: 250px;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 20px;
  text-align: center;

  .sidebar__item {
    display: flex;
    position: relative;

    .sidebar__link {
      font-size: clamp(16px, 3vw, 18px);
      font-weight: 500;
      line-height: 1.1;
      color: $dark-blue;
      padding-block: 10px;
      position: relative;
      display: flex;
      flex-grow: 1;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        background-color: $mid-blue;
        opacity: 0;
        -webkit-transform: translateY(5px);
        -moz-transform: translateY(5px);
        transform: translateY(5px);
        -webkit-transition: -webkit-transform 0.3s, opacity 0.3s;
        -moz-transition: -moz-transform 0.3s, opacity 0.3s;
        transition: transform 0.3s, opacity 0.3s;
        pointer-events: none;
      }

      @media (hover: hover) {
        &:hover {
          color: $mid-blue;

          &::after {
            opacity: 1;
          }
        }
      }
      @media (hover: none) {
        &:active {
          color: $mid-blue;

          &::after {
            opacity: 1;
          }
        }
      }

      .sidebar__link-text {
        flex-grow: 1;
      }
    }

    .sidebar__btn-container {
      position: absolute;
      top: 20%;
      right: 0;
      opacity: 0.3;
      transition: opacity 0.3s ease-in-out;
      background-color: white;
      mix-blend-mode: difference;

      &:hover {
        opacity: 1;
      }

      .sidebar__remove-btn {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }
  }
}

@media screen and (max-width: 900px) {
  .sidebar {
    order: -1;
    flex-basis: auto;
    max-width: 300px;
    width: 100%;
  }
}
</style>
