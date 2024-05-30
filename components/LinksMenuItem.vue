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
    <div :class="{ 'links-menu-item_admin': isInAdminPage }">
      <NuxtLink
        :class="['links-menu-item__link', { 'links-menu-item__link_in-list': isInSiteMap }]"
        :to="(link?.to as RouteLocationRaw)"
      >
        {{ link?.title }}
      </NuxtLink>
      <div v-if="isInAdminPage && link?.couldBeEdited" class="links-menu-item__btn-container">
        <EditBtn
          :color="'black'"
          @click="emit('onEdit', link?._id, link?.title, link?.to, group?._id)"
        />
        <RemoveBtn @click="emit('onRemove', link?._id, link?.title, group?._id)" />
      </div>
    </div>
    <ul v-if="link?.to === '/labs-and-centers'">
      <li
        v-for="group of labsAndCentersGroups"
        :key="JSON.stringify(group)"
        class="links-menu-item__group"
      >
        <p class="links-menu-item__group-title">{{ group.title }}</p>
        <ul class="links-menu-item__group-links">
          <li v-for="link of group.links">
            <NuxtLink :to="`/labs-and-centers${link.to}`">
              {{ link.title }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</template>

<style scoped lang="scss">
@import url('~/assets/styles/components/linksMenuItem.scss');
</style>
