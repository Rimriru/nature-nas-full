<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import type { Link, LinkGroup } from '~/types/LinkDataFromDb';

defineProps({
  link: {
    type: Object as () => Link
  },
  group: {
    type: Object as () => LinkGroup
  },
  isInAdminPage: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['onEdit', 'onRemove']);
</script>

<template>
  <li :class="{ li_admin: isInAdminPage }">
    <NuxtLink
      :to="(link?.to as RouteLocationRaw)"
      :class="{ 'li__link_not-admin': !isInAdminPage }"
    >
      {{ link?.title }}
    </NuxtLink>
    <div v-if="isInAdminPage">
      <EditBtn @click="emit('onEdit', link?._id, link?.title, link?.to, group?._id)" />
      <RemoveBtn @click="emit('onRemove', link?._id, link?.title, group?._id)" />
    </div>
  </li>
</template>

<style lang="scss">
.li_admin {
  display: flex;
  position: relative;
  gap: 25px;

  &::before {
    content: '';
    position: absolute;
    transform: translateY(-50%);
    top: 75%;
    border-radius: 50%;
    left: -12px;
    margin-top: -7px;
    width: 6px;
    height: 6px;
    background: #000;
  }
  div {
    display: inline-flex;
    gap: 5px;
  }
}

.li__link_not-admin {
  display: flex;
}
</style>
