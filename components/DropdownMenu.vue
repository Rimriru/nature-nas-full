<script setup lang="ts">
const isSubMenuVisible = ref(false);
const props = defineProps(['title', 'group', 'to', 'items']);
const emit = defineEmits(['onAddLink']);
</script>

<template>
  <div
    class="dropdown-menu"
    @mouseover="isSubMenuVisible = true"
    @mouseleave="isSubMenuVisible = false"
  >
    <a v-if="!props.to" class="dropdown-menu__main-link" href="#">{{ title }}</a>
    <NuxtLink v-else :to="props.to" class="dropdown-menu__main-link">{{ title }}</NuxtLink>
    <ul v-if="isSubMenuVisible && group" class="dropdown-menu__sub-menu">
      <LinksMenuItem :links-array="items" :group="props.group" :is-in-admin-page="false" />
      <div class="dropdown-menu__btn-bg" @click="emit('onAddLink', title, props.group)">
        <button class="dropdown-menu__add-btn" type="button" />
      </div>
    </ul>
  </div>
</template>

<style lang="scss">
@import url('~/assets/styles/components/dropdownMenu.scss');
</style>
