<script setup lang="ts">
import type { Link, LinkGroup } from '~/types/LinkDataFromDb';

const isSubMenuVisible = ref(false);
const props = defineProps(['title', 'group', 'to', 'id', 'linkGroups', 'openedDropdownMenu']);
const emit = defineEmits(['onAddLink', 'onMenuChange']);
const { width } = useWindowSize();
const linkGroupsState = useLinkGroupsState();

const linksOfTheGroup = computed(() => {
  const group: LinkGroup | undefined = linkGroupsState.value.find(
    (item: LinkGroup) => item.group === props.group
  );
  const links: Link[] | undefined = group?.links;
  return { group, links };
});

const toggleDropdown = () => {
  if (props.openedDropdownMenu === props.id) {
    isSubMenuVisible.value = false;
    emit('onMenuChange', '');
  } else {
    emit('onMenuChange', props.id);
    isSubMenuVisible.value = true;
  }
};

const handlePointerDownOnMenu = computed(() => {
  return width.value <= 900 ? toggleDropdown : undefined;
});

const handleAddLinkBtnClick = (title: string) => {
  emit('onAddLink', title, linksOfTheGroup.value.group?._id);
};
</script>

<template>
  <div
    class="dropdown-menu"
    @mouseover="isSubMenuVisible = true"
    @mouseleave="isSubMenuVisible = false"
  >
    <a
      v-if="!to"
      :class="[
        'dropdown-menu__main-link',
        {
          'dropdown-menu__main-link_active':
            width <= 900 && isSubMenuVisible && props.openedDropdownMenu === props.id
        }
      ]"
      @pointerdown="handlePointerDownOnMenu"
      >{{ title }}</a
    >
    <NuxtLink v-else :to="to" class="dropdown-menu__main-link">{{ title }}</NuxtLink>
    <ul
      v-if="
        isSubMenuVisible && group && (width <= 900 ? props.openedDropdownMenu === props.id : true)
      "
      class="dropdown-menu__sub-menu"
    >
      <LinksMenuItem
        v-for="link of linksOfTheGroup.links"
        :link="link"
        :is-in-admin-page="false"
        :is-in-site-map="false"
      />
      <AddLinkButton
        :color="'dark-blue'"
        :size="'sm'"
        :rounded="true"
        @on-click="handleAddLinkBtnClick(title)"
      />
    </ul>
  </div>
</template>

<style lang="scss">
@import url('~/assets/styles/components/dropdownMenu.scss');
</style>
