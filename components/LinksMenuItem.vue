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
    <NuxtLink class="li__link" :to="(link?.to as RouteLocationRaw)">
      {{ link?.title }}
    </NuxtLink>
    <div v-if="isInAdminPage && link?.couldBeEdited">
      <EditBtn
        :color="'black'"
        @click="emit('onEdit', link?._id, link?.title, link?.to, group?._id)"
      />
      <RemoveBtn @click="emit('onRemove', link?._id, link?.title, group?._id)" />
    </div>
  </li>
</template>

<style lang="scss">
.li_admin {
  position: relative;
  display: flex;
  gap: 25px;
  align-items: center;
  margin-bottom: 10px;

  &::before {
    content: '';
    position: absolute;
    transform: translateY(-50%);
    top: 66%;
    border-radius: 50%;
    left: -15px;
    margin-top: -7px;
    width: 6px;
    height: 6px;
    background: #000;
  }

  .li__link {
    padding: 0;
  }
  div {
    display: inline-flex;
    gap: 5px;
  }
}

.li__link {
  padding: 8px;
}
</style>
