<script setup lang="ts">
const isOpened = usePopupOpeningState();
const isAddSectionPopupOpened = usePopupOpeningState();

const handleClickOutsidePopup = () => (isAddSectionPopupOpened.value = false);
</script>

<template>
  <div class="popup" :class="{ popup__opened: isOpened }" @click.self="handleClickOutsidePopup">
    <div class="popup__container">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
@import url('~/assets/styles/components/appPopup.scss');
</style>
