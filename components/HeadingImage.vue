<script setup lang="ts">
const pageTitle = usePageTitle();
const router = useRouter();

router.beforeEach((to, from) => {
  pageTitle.value = '';
});
</script>

<template>
  <div class="heading-image">
    <h1 class="heading-image__title">{{ pageTitle }}</h1>
    <div class="heading-image__img"></div>
  </div>
</template>

<style lang="scss">
.heading-image {
  width: 100%;
  height: 227px;
  position: relative;

  .heading-image__title {
    color: #fff;
    top: 95px;
    left: 13vw;
    position: absolute;
    z-index: 80;
    font-size: 24px;
    font-weight: 600;
    text-shadow: 6px 1px 6px rgba(0, 0, 0, 0.6);
  }

  .heading-image__img {
    background-image: url('~/assets/images/main-photo.jpg');
    position: relative;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    z-index: 1;
  }
}
</style>
