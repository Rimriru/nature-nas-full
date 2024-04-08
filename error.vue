<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps({
  error: Object as () => NuxtError
});
</script>

<template>
  <NuxtLayout>
    <div class="error-container">
      <template v-if="props.error?.statusCode === 404">
        <div class="error__code">
          <p class="error__code-title">4</p>
          <ErrorEye />
          <p class="error__code-title">4</p>
        </div>
        <span class="error__code-text">{{ props.error?.message }}!</span>
      </template>
      <template v-else>
        <h1 class="error__code-title">{{ props.error?.statusCode }}</h1>
        <p class="error__code-text">{{ props.error?.message }}</p>
      </template>
      <NuxtLink class="error__link" to="/" replace> Вернуться на главную </NuxtLink>
    </div>
  </NuxtLayout>
</template>

<style lang="scss">
.error-container {
  max-width: 800px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  .error__code {
    display: flex;
    align-items: baseline;
  }

  .error__code-title {
    font-size: 137px;
    line-height: 1.2;
  }

  .error__code-text {
    font-size: 20px;
    line-height: 1.1;
    margin-bottom: 20px;
  }

  .error__link {
    font-size: 18px;
  }
}
</style>
