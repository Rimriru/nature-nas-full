<template>
  <button class="submit-btn" type="submit">
    <slot />
  </button>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
.submit-btn {
  width: clamp(120px, 15vw, 180px);
  color: #fff;
  font-size: 1rem;
  border-radius: 15px;
  padding-block: 8px;
  margin: 0 auto;
  background-color: $light-blue;
}
</style>
