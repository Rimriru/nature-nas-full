<script setup lang="ts">
import type Photo from '~/types/MainPhotoDataFromDb';
const pageTitle = usePageTitle();
const router = useRouter();

router.beforeEach((to, from) => {
  pageTitle.value = '';
});

const initialPhoto = ref<Photo>({
  _id: '',
  name: ''
});
const photoForLoading = ref<File | ''>('');
const isImageLoadFormOpen = ref(false);
const notifications = useToast();
const config = useRuntimeConfig();

const photoState = useMainPhotoState();
initialPhoto.value = photoState.value[0];

const handleEditBtnClick = () => {
  isImageLoadFormOpen.value = true;
};

const handlePhotoChange = (file: File | '') => {
  photoForLoading.value = file;
};

const handleFormClose = () => {
  isImageLoadFormOpen.value = false;
  photoForLoading.value = '';
};

const handleFormSubmit = async () => {
  try {
    const body = new FormData();
    body.append('images', photoForLoading.value);

    await $fetch('/api/images', {
      method: 'post',
      body,
      async onResponse({ response }) {
        if (response.ok) {
          const previousPhoto = initialPhoto.value;
          if (previousPhoto.name) {
            $fetch(`/api/images/${previousPhoto}`, {
              method: 'delete'
            });
          }
          photoState.value = response._data;
          handleFormClose();
        } else {
          notifications.add({
            id: 'photo',
            title: String(response.status),
            description: response.statusText
          });
          return;
        }
      }
    });

    await $fetch(`/api/main-photo/${photoState.value}`);
  } catch (error: any) {
    console.error(error);
    notifications.add({
      id: 'photo',
      title: String(error.status),
      description: error.statusText
    });
  }
};
</script>

<template>
  <div
    :class="['heading-image', { 'heading-image_main': ['/', '/admin'].includes($route.fullPath) }]"
  >
    <h1 class="heading-image__title">{{ pageTitle }}</h1>
    <div
      :class="[
        'heading-image__img',
        { 'heading-image__img_main': ['/', '/admin'].includes($route.fullPath) }
      ]"
      :style="{ backgroundImage: `url(${config.public.domen}/image/${photoState})` }"
    ></div>
    <div
      v-if="$route.fullPath === '/admin'"
      class="heading-image__edit-btn"
      @click="handleEditBtnClick"
    >
      <EditBtn :color="'black'" />
    </div>
    <LazyImageLoadForm
      v-if="$route.fullPath === '/admin'"
      :is-open="isImageLoadFormOpen"
      :loaded-photo="photoForLoading"
      @on-change="handlePhotoChange"
      @on-submit="handleFormSubmit"
      @on-close="handleFormClose"
    />
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.heading-image {
  width: 100%;
  height: 227px;
  position: relative;

  &_main {
    height: 380px;
  }

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
    //background-image: url('~/assets/images/main-photo.jpg');
    position: relative;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    z-index: 1;

    &_main {
      //background-image: url('~/assets/images/main-photo-full.jpg');
    }
  }

  .heading-image__edit-btn {
    background-color: $light-blue;
    mix-blend-mode: screen;
    position: absolute;
    bottom: 10px;
    left: 10px;
    width: 50px;
    height: 50px;
    z-index: 2;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
</style>
