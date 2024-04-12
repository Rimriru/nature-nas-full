<script setup lang="ts">
import type { Link, LinkGroup } from '~/types/LinkDataFromDb';

const isSubMenuVisible = ref(false);
const props = defineProps(['title', 'group', 'to', 'linkGroups']);
const emit = defineEmits(['onAddLink']);

const linksOfTheGroup = computed(() => {
  const group: LinkGroup = props.linkGroups.find((item: LinkGroup) => item.group === props.group);
  const links: Link[] = group.links;
  return { group, links };
});
</script>

<template>
  <div
    class="dropdown-menu"
    @mouseover="isSubMenuVisible = true"
    @mouseleave="isSubMenuVisible = false"
  >
    <a v-if="!to" class="dropdown-menu__main-link" href="#">{{ title }}</a>
    <NuxtLink v-else :to="to" class="dropdown-menu__main-link">{{ title }}</NuxtLink>
    <ul v-if="isSubMenuVisible && group" class="dropdown-menu__sub-menu">
      <LinksMenuItem v-for="link of linksOfTheGroup.links" :link="link" :is-in-admin-page="false" />
      <AddLinkButton
        :color="'dark-blue'"
        :size="'sm'"
        :rounded="true"
        @on-click="emit('onAddLink', title, linksOfTheGroup.group._id)"
      />
    </ul>
  </div>
</template>

<style lang="scss">
@import url('~/assets/styles/components/dropdownMenu.scss');
</style>
