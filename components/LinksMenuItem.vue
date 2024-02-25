<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import type Link from '~/types/LinkDataFromDb';

const props = defineProps({
  linksArray: {
    type: Array as () => Link[],
    required: true
  },
  group: {
    type: String
  },
  isInAdminPage: {
    type: Boolean,
    required: true
  }
});

const linksOfTheGroup = computed(() => {
  return props.linksArray.filter((item: Link) => item.group === props.group);
});
</script>

<template>
  <li
    v-for="item of linksOfTheGroup"
    :key="JSON.stringify(item)"
    :class="{ 'li-admin': isInAdminPage }"
  >
    <NuxtLink :to="(item.to as RouteLocationRaw)" external>
      {{ item.title }}
    </NuxtLink>
    <div v-if="isInAdminPage">
      <EditBtn />
      <RemoveBtn />
    </div>
  </li>
</template>

<style lang="scss">
.li-admin {
  display: flex;
  gap: 10px;
}
</style>
