<script setup lang="ts"></script>

<template>
  <div class="labs-centers">
    <SideMenu />
    <NuxtPage />
  </div>
</template>

<style lang="scss">
.labs-centers {
  display: flex;
  gap: clamp(10px, 2vw, 30px);
  justify-content: center;
  padding-bottom: 20px;
  width: calc(100% - 80px * 2);
  margin: 0 auto;

  & > *:first-child {
    flex-shrink: 0.75;
  }

  & > *:last-child {
    flex-shrink: 1;
  }
}

@media screen and (max-width: 900px) {
  .labs-centers {
    flex-direction: column;
    align-items: center;
    width: calc(100% - 20px * 2);
  }
}
</style>
