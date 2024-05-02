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
.links-menu-item_admin {
  position: relative;
  display: flex;
  gap: 25px;
  align-items: center;
  margin-bottom: 10px;
  .links-menu-item__btn-container {
    display: inline-flex;
    gap: 5px;
  }
}

.links-menu-item__link {
  padding: 8px;
}

.links-menu-item__link_in-list {
  padding: 0;
  font-size: 18px;
}

.links-menu-item__group {
  margin: 0 0 20px 30px;
  list-style: circle;

  &:first-of-type {
    margin-top: 10px;
  }

  .links-menu-item__group-title {
    margin-bottom: 8px;
    font-weight: 500;
  }

  .links-menu-item__group-links {
    list-style: square;
    margin-left: 30px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
}
</style>
