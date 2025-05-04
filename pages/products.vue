<script setup lang="ts">
import SidebarLinkEditor from '~/components/SidebarLinkEditor.vue';
import type { Link } from '~/types/LinkDataFromDb';

const PRODUCTS_PAGE = 'products';
const linkGroupsState = useLinkGroupsState();
const productsLinkGroup = linkGroupsState.value.find((group) => group.group === PRODUCTS_PAGE);
const productsLinks = computed(() => productsLinkGroup?.links);
const router = useRouter();

if (productsLinks.value?.length) {
  router.push({
    path: `/${PRODUCTS_PAGE}${productsLinks.value[0].to}`,
    replace: true
  });
}

const onAddNewLink = (newLink: Link) => {
  const linkGroupIndex = linkGroupsState.value.findIndex(
    (group) => group._id === productsLinkGroup?._id
  );
  linkGroupsState.value[linkGroupIndex].links.push(newLink);
  router.push({
    path: `/${PRODUCTS_PAGE}${
      productsLinks.value ? productsLinks.value[productsLinks.value.length - 1].to : ''
    }`
  });
};

const onEditLink = (editedLinkId: string, editedLink: Link) => {
  const groupIndex = linkGroupsState.value.findIndex((group) => group.group === PRODUCTS_PAGE);
  const linkIndex = linkGroupsState.value[groupIndex].links.findIndex(
    (link) => link._id === editedLinkId
  );
  linkGroupsState.value[groupIndex].links[linkIndex] = editedLink;
};

const onRemoveLink = (linkId: string, linkTo: string) => {
  const groupIndex = linkGroupsState.value.findIndex((group) => group.group === PRODUCTS_PAGE);
  linkGroupsState.value[groupIndex].links = linkGroupsState.value[groupIndex].links.filter(
    (link) => link._id !== linkId
  );
  if (linkTo === `/${router.currentRoute.value.params.route}`) {
    router.push({
      path: `/${PRODUCTS_PAGE}${productsLinks.value?.length ? productsLinks.value[0].to : ''}`,
      replace: true
    });
  }
};
</script>

<template>
  <SidebarLinkEditor
    :page="PRODUCTS_PAGE"
    :links="productsLinks"
    :group="productsLinkGroup"
    @on-add-new-link="onAddNewLink"
    @on-edit-link="onEditLink"
    @on-remove-link="onRemoveLink"
  />
</template>

<style lang="scss"></style>
