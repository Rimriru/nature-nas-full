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
      :style="{
        backgroundImage: `url(${
          $config.public.process === 'production' ? '' : $config.public.domen
        }/image/${photoState[0].name})`
      }"
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
@import url('~/assets/styles/components/headingImage.scss');
</style>
