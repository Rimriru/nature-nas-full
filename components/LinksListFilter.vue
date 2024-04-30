<script setup lang="ts">
const props = defineProps(['group', 'isAdminPage']);
const linkGroups = useLinkGroupsState();

interface LinkActions {
  onEditLinkClick: (
    linkId: String | undefined,
    linkTitle: String | undefined,
    linkTo: String | undefined
  ) => void;
  onRemoveLinkClick: (linkId: String | undefined, linkTitle: String | undefined) => void;
}

const linkActions = inject('linkActions') as LinkActions;

const filteredLinks = computed(() => {
  const group = linkGroups.value.find((linkGroup) => linkGroup.group === props.group);
  const links = group?.links;
  return { group, links };
});
</script>

<template>
  <LinksMenuItem
    v-for="link of filteredLinks.links"
    :link="link"
    :group="filteredLinks.group"
    :is-in-admin-page="props.isAdminPage"
    :is-in-site-map="true"
    @on-edit="linkActions.onEditLinkClick"
    @on-remove="linkActions.onRemoveLinkClick"
  />
</template>

<style scoped></style>
