<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import type { Link } from '~/types/LinkDataFromDb';

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

const emit = defineEmits(['onEdit', 'onRemove']);

const linksOfTheGroup = computed(() => {
  return props.linksArray.filter((item: Link) => item.group === props.group);
});
</script>

<template>
  <li
    v-for="item of linksOfTheGroup"
    :key="JSON.stringify(item)"
    :class="{ li_admin: isInAdminPage }"
  >
    <NuxtLink
      :to="(item.to as RouteLocationRaw)"
      external
      :class="{ 'li__link_not-admin': !isInAdminPage }"
    >
      {{ item.title }}
    </NuxtLink>
    <div v-if="isInAdminPage">
      <EditBtn @click="emit('onEdit', item._id, item.title, item.to)" />
      <RemoveBtn @click="emit('onRemove', item._id, item.title)" />
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
