<script setup lang="ts">
const onUpButtonClick = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
};
</script>

<template>
  <button class="up-button" type="button" @click="onUpButtonClick">
    <svg class="svgIcon" viewBox="0 0 384 512">
      <path
        d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
      ></path>
    </svg>
  </button>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.up-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: $mid-blue;
  border: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 0px 4px rgba($gray, 0.2);
  cursor: pointer;
  transition-duration: 0.3s;
  overflow: hidden;
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 300;

  &:hover {
    width: 140px;
    border-radius: 50px;
    transition-duration: 0.3s;
    background-color: $light-blue;
    align-items: center;
    box-shadow: 0px 0px 0px 4px rgba($gray, 0.5);

    .svgIcon {
      /* width: 20px; */
      transition-duration: 0.3s;
      transform: translateY(-200%);
    }

    &::before {
      font-size: 13px;
      opacity: 1;
      bottom: unset;
      /* transform: translateY(-30px); */
      transition-duration: 0.3s;
    }
  }

  &::before {
    position: absolute;
    bottom: -20px;
    content: 'Наверх';
    color: white;
    /* transition-duration: .3s; */
    font-size: 0px;
    z-index: 300;
  }

  .svgIcon {
    width: 12px;
    transition-duration: 0.3s;

    path {
      fill: white;
    }
  }
}
</style>
