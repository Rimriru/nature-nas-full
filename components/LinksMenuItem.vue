<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import type { Link, LinkGroup } from '~/types/LinkDataFromDb';

const props = defineProps({
  link: {
    type: Object as () => Link
  },
  group: {
    type: Object as () => LinkGroup
  },
  isInAdminPage: {
    type: Boolean,
    required: true
  },
  isInSiteMap: {
    type: Boolean,
    required: true
  }
});
const emit = defineEmits(['onEdit', 'onRemove']);
const labsAndCentersGroups = ref<LinkGroup[] | undefined>();

if (props.isInSiteMap && props.link?.to === '/labs-and-centers') {
  labsAndCentersGroups.value = inject<LinkGroup[] | undefined>('labsAndCentersGroups');
}
</script>

<template>
  <li>
    <div :class="{ 'link-menu-item_admin': isInAdminPage }">
      <NuxtLink class="link-menu-item__link" :to="(link?.to as RouteLocationRaw)">
        {{ link?.title }}
      </NuxtLink>
      <div v-if="isInAdminPage && link?.couldBeEdited" class="link-menu-item__btn-container">
        <EditBtn
          :color="'black'"
          @click="emit('onEdit', link?._id, link?.title, link?.to, group?._id)"
        />
        <RemoveBtn @click="emit('onRemove', link?._id, link?.title, group?._id)" />
      </div>
    </div>
    <ul v-if="link?.to === '/labs-and-centers'">
      <li v-for="group of labsAndCentersGroups" :key="JSON.stringify(group)">
        <p>{{ group.title }}</p>
        <ul>
          <li v-for="link of group.links">
            <NuxtLink :to="link.to">
              {{ link.title }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</template>

<style scoped lang="scss">
.link-menu-item_admin {
  position: relative;
  display: flex;
  gap: 25px;
  align-items: center;
  margin-bottom: 10px;

  .link-menu-item__link {
    padding: 0;
  }
  .link-menu-item__btn-container {
    display: inline-flex;
    gap: 5px;
  }
}

.link-menu-item__link {
  padding: 8px;
}
</style>
