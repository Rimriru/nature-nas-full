<script setup lang="ts">
const pageTitle = usePageTitle();
const router = useRouter();

router.beforeEach((to, from) => {
  pageTitle.value = '';

  if (to.meta.title) {
    pageTitle.value = to.meta.title as string;
  }
});

if (router.currentRoute.value.meta.title) {
  pageTitle.value = router.currentRoute.value.meta.title as string;
}

const photoForLoading = ref<File | ''>('');
const isImageLoadFormOpen = ref(false);
const notifications = useToast();
const config = useRuntimeConfig();

const photoState = useMainPhotoState();

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
          const previousPhoto = photoState.value;
          if (previousPhoto) {
            await $fetch(`/api/images/${previousPhoto[0].name}`, {
              method: 'delete'
            });

            await $fetch(`/api/main-photo/${photoState.value[0]._id}`, {
              method: 'patch',
              body: {
                name: response._data[0]
              },
              onResponse({ response }) {
                if (response.ok) {
                  photoState.value[0] = response._data;
                  handleFormClose();

                  notifications.add({
                    id: 'photo',
                    title: 'Главное фото успешно изменено!'
                  });
                } else {
                  notifications.add({
                    id: 'photo',
                    title: String(response.status),
                    description: response.statusText
                  });
                }
              }
            });
          }
        } else {
          notifications.add({
            id: 'photo',
            title: String(response.status),
            description: response.statusText
          });
        }
      }
    });
  } catch (error: any) {
    console.error(error);
    notifications.add({
      id: 'photo',
      title: String(error.statusCode),
      description: error.data.message
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
      :style="{ backgroundImage: `url(${config.public.domen}/image/${photoState[0].name})` }"
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
  overflow: hidden;

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
    margin-right: 20px;
  }

  .heading-image__img {
    position: relative;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    z-index: 1;
    background-size: cover;
    background-position: center center;
  }

  .heading-image__edit-btn {
    background-color: $light-blue;
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
