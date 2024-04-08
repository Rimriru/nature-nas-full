<script setup lang="ts">
import type { Link } from '~/types/LinkDataFromDb';

const linkGroups = useLinkGroupsState();

const labsLinkGroups = computed(() => {
  const links: Link[] = [];
  const groups = linkGroups.value.filter((group) => group.group === 'labs-and-centers');
  groups.forEach((group) => links.push(...group.links));
  return links;
});

if (labsLinkGroups.value[0]) {
  await navigateTo(`/labs-and-centers${labsLinkGroups.value[0].to}`, { replace: true });
}
</script>

<template>
  <div class="labs-centers">
    <SideMenu />
    <NuxtPage :keepalive="true" />
  </div>
</template>

<style lang="scss">
.labs-centers {
  display: flex;
  gap: 100px;
}
</style>
