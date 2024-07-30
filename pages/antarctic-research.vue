<script setup lang="ts">
import SidebarLinkEditor from '~/components/SidebarLinkEditor.vue';
import type { Link } from '~/types/LinkDataFromDb';

const linkGroupsState = useLinkGroupsState();
const antarResLinkGroup = linkGroupsState.value.find((group) => group.group === 'antarctic-res');
const antarResLinks = computed(() => antarResLinkGroup?.links);
const router = useRouter();
const ANTARCTIC_PAGE = 'antarctic-research';

if (antarResLinks.value && antarResLinks.value.length) {
  router.push({
    path: `/${ANTARCTIC_PAGE}${antarResLinks.value[0].to}`,
    replace: true
  });
}

const onAddNewLink = (newLink: Link) => {
  const linkGroupIndex = linkGroupsState.value.findIndex(
    (group) => group._id === antarResLinkGroup?._id
  );
  linkGroupsState.value[linkGroupIndex].links.push(newLink);
  router.push({
    path: `/${ANTARCTIC_PAGE}${
      antarResLinks.value ? antarResLinks.value[antarResLinks.value.length - 1].to : ''
    }`,
    replace: true
  });
};

const onEditLink = (editedLinkId: string, editedLink: Link) => {
  const groupIndex = linkGroupsState.value.findIndex((group) => group.group === 'antarctic-res');
  const linkIndex = linkGroupsState.value[groupIndex].links.findIndex(
    (link) => link._id === editedLinkId
  );
  linkGroupsState.value[groupIndex].links[linkIndex] = editedLink;
};

const onRemoveLink = (linkId: string, linkTo: string) => {
  const groupIndex = linkGroupsState.value.findIndex((group) => group.group === 'antarctic-res');
  linkGroupsState.value[groupIndex].links = linkGroupsState.value[groupIndex].links.filter(
    (link) => link._id !== linkId
  );
  if (linkTo === `/${router.currentRoute.value.params.route}`) {
    router.push({
      path: `/${ANTARCTIC_PAGE}${
        antarResLinks.value && antarResLinks.value.length ? antarResLinks.value[0].to : ''
      }`,
      replace: true
    });
  }
};
</script>

<template>
  <SidebarLinkEditor
    :page="ANTARCTIC_PAGE"
    :links="antarResLinks"
    :group="antarResLinkGroup"
    @on-add-new-link="onAddNewLink"
    @on-edit-link="onEditLink"
    @on-remove-link="onRemoveLink"
  />
</template>

<style lang="scss"></style>
