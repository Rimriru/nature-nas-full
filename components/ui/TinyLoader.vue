<script setup lang="ts"></script>

<template>
  <div class="tiny-loader"></div>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.tiny-loader {
  width: 75px;
  height: 30px;
  aspect-ratio: 2.5;
  margin: 0 auto;
  --_g: no-repeat radial-gradient(farthest-side, #569aff 90%, #0000);
  background: var(--_g), var(--_g), var(--_g), var(--_g);
  background-size: 20% 50%;
  animation: l43 1s infinite linear;
}
@keyframes l43 {
  0% {
    background-position: calc(0 * 100% / 3) 50%, calc(1 * 100% / 3) 50%, calc(2 * 100% / 3) 50%,
      calc(3 * 100% / 3) 50%;
  }
  16.67% {
    background-position: calc(0 * 100% / 3) 0, calc(1 * 100% / 3) 50%, calc(2 * 100% / 3) 50%,
      calc(3 * 100% / 3) 50%;
  }
  33.33% {
    background-position: calc(0 * 100% / 3) 100%, calc(1 * 100% / 3) 0, calc(2 * 100% / 3) 50%,
      calc(3 * 100% / 3) 50%;
  }
  50% {
    background-position: calc(0 * 100% / 3) 50%, calc(1 * 100% / 3) 100%, calc(2 * 100% / 3) 0,
      calc(3 * 100% / 3) 50%;
  }
  66.67% {
    background-position: calc(0 * 100% / 3) 50%, calc(1 * 100% / 3) 50%, calc(2 * 100% / 3) 100%,
      calc(3 * 100% / 3) 0;
  }
  83.33% {
    background-position: calc(0 * 100% / 3) 50%, calc(1 * 100% / 3) 50%, calc(2 * 100% / 3) 50%,
      calc(3 * 100% / 3) 100%;
  }
  100% {
    background-position: calc(0 * 100% / 3) 50%, calc(1 * 100% / 3) 50%, calc(2 * 100% / 3) 50%,
      calc(3 * 100% / 3) 50%;
  }
}
</style>
