<script setup lang="ts">
const emit = defineEmits(['add-link']);

const props = defineProps<{
  isOpen: boolean;
}>();

const { width } = useWindowSize();

const isMenuOpen = ref(false);
const openedDropdownMenu = ref<'' | string>('');

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      isMenuOpen.value = true;
    } else {
      isMenuOpen.value = false;
    }
  }
);

const handleOpenedDropdownMenuChange = (id: string) => {
  openedDropdownMenu.value = id;
};

const handleAddLinkBtnClick = (title: string, groupId: string) => {
  emit('add-link', title, groupId);
};
</script>

<template>
  <ul :class="['header__bottom-links', { 'header__bottom-links_open': isMenuOpen && width < 900 }]">
    <li v-for="{ _id: id, title, group, to } of HEADER_LINK_GROUPS" :key="id">
      <DropdownMenu
        class="header__bottom-dropdown"
        :title="title.toUpperCase()"
        :group="group"
        :to="to"
        :id="id"
        :openedDropdownMenu="openedDropdownMenu"
        @on-add-link="handleAddLinkBtnClick"
        @on-menu-change="handleOpenedDropdownMenuChange"
      />
    </li>
  </ul>
</template>

<style lang="scss"></style>
