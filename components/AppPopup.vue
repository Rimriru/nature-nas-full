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
.popup {
  width: 100%;
  height: 100%;
  background-color: hsla(0, 1%, 20%, 0);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  visibility: hidden;
  z-index: 100;
  transition: background 0.4s ease-in-out;

  &.popup__opened {
    background-color: hsla(0, 1%, 20%, 0.3);
    visibility: visible;
  }

  .popup__container {
    position: absolute;
    max-width: 550px;
    padding: 25px 15px;
    z-index: 101;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 20px;
  }
}
</style>
