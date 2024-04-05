<script setup lang="ts">
import type { Link } from '~/types/LinkDataFromDb';
const linkGroups = useLinkGroupsState();
const labsLinkGroups = computed(() => {
  return linkGroups.value.filter((group) => group.group === 'labs-and-centers');
});
const allLinks = computed(() => {
  const links: Link[] = [];
  labsLinkGroups.value.forEach((group) => links.push(...group.links));
  return links;
});

if (allLinks.value[0]) {
  await navigateTo(`/labs-and-centers${allLinks.value[0].to}`);
}
</script>

<template>
  <SideMenu />
</template>

<style lang="scss"></style>
