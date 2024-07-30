<script setup lang="ts">
import SidebarLinkEditor from '~/components/SidebarLinkEditor.vue';
import type { Link } from '~/types/LinkDataFromDb';

useSeoMeta({
  title: 'Монографии'
});

definePageMeta({
  title: 'Монографии'
});

const monographsState = useMgraphsState();
const monographsFromDb = await useMgraphs();
monographsState.value = monographsFromDb;

const MONOGRAPHS_PAGE = 'monographs';
const linkGroupsState = useLinkGroupsState();
const monographsLinkGroup = linkGroupsState.value.find((group) => group.group === MONOGRAPHS_PAGE);
const monographsLinks = computed(() => monographsLinkGroup?.links);

const modifiedLinksArray = computed(() => {
  return monographsLinks.value
    ?.map((link) => {
      const linkMgraphs = monographsState.value.filter((mono) => `/${mono.year}` === link.to);
      return { ...link, linkMgraphs: linkMgraphs.length };
    })
    .sort((a, b) => b.title.localeCompare(a.title));
});

const router = useRouter();
if (modifiedLinksArray.value && modifiedLinksArray.value.length) {
  router.push({
    path: `/${MONOGRAPHS_PAGE}${modifiedLinksArray.value[0].to}`,
    replace: true
  });
}
const onAddNewLink = (newLink: Link) => {
  const linkGroupIndex = linkGroupsState.value.findIndex(
    (group) => group._id === monographsLinkGroup?._id
  );
  linkGroupsState.value[linkGroupIndex].links.push(newLink);
  router.push({
    path: `/${MONOGRAPHS_PAGE}${
      monographsLinks.value ? monographsLinks.value[monographsLinks.value.length - 1].to : ''
    }`,
    replace: true
  });
};

const onEditLink = (editedLinkId: string, editedLink: Link) => {
  const groupIndex = linkGroupsState.value.findIndex((group) => group.group === MONOGRAPHS_PAGE);
  const linkIndex = linkGroupsState.value[groupIndex].links.findIndex(
    (link) => link._id === editedLinkId
  );
  linkGroupsState.value[groupIndex].links[linkIndex] = editedLink;
};

const onRemoveLink = (linkId: string, linkTo: string) => {
  const groupIndex = linkGroupsState.value.findIndex((group) => group.group === MONOGRAPHS_PAGE);
  linkGroupsState.value[groupIndex].links = linkGroupsState.value[groupIndex].links.filter(
    (link) => link._id !== linkId
  );
  if (linkTo === `/${router.currentRoute.value.params.route}`) {
    router.push({
      path: `/${MONOGRAPHS_PAGE}${
        monographsLinks.value && monographsLinks.value.length ? monographsLinks.value[0].to : ''
      }`,
      replace: true
    });
  }
};
</script>

<template>
  <SidebarLinkEditor
    :page="MONOGRAPHS_PAGE"
    :links="modifiedLinksArray"
    :group="monographsLinkGroup"
    @on-add-new-link="onAddNewLink"
    @on-edit-link="onEditLink"
    @on-remove-link="onRemoveLink"
  />
</template>

<style lang="scss"></style>
