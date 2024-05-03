<script setup lang="ts">
const isLoggedIn = useLoggedInState();
</script>

<template>
  <button v-if="isLoggedIn" type="button" class="remove-btn button" />
</template>

<style lang="scss">
.remove-btn {
  background-image: url('~/assets/images/remove-btn.svg');
  width: 24px;
  height: 24px;
  background-size: 100%;
}
</style>
