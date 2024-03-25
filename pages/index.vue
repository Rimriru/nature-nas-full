<script setup lang="ts">
const file = ref<File | string>('');
const newlyUploadedFile = ref<string>('');
const notifications = useToast();

const handleFileChange = (fileData: Event) => {
  const fileInputData = fileData.target as HTMLInputElement;
  if (fileInputData.files && fileInputData.files?.length > 0) {
    file.value = fileInputData.files[0];
  }
};

const handleFileUpload = async () => {
  const body = new FormData();
  body.append('file', file.value);
  await $fetch('/api/images', {
    method: 'post',
    body,
    onResponse({ response }) {
      if (!response.ok) {
        notifications.add({
          id: 'file-upload',
          title: `Ошибка ${response._data.statusCode}: ${response._data.message}`
        });
      } else {
        // newlyUploadedFile.value = `http://localhost:4000/image/${response._data}`;
      }
    }
  });
};
</script>

<template>
  <main class="page-content">
    <p class="title">Ты на главной!</p>
    <div class="links">
      <NuxtLink to="/admin">To admin</NuxtLink>
      <NuxtLink to="/look">To Canvas One</NuxtLink>
    </div>
    <form enctype="multipart/form-data" @submit.prevent="handleFileUpload">
      <input type="file" @change="handleFileChange" />
      <button type="submit">Отправить</button>
    </form>
    <!-- <div>
      <img :src="newlyUploadedFile" />
      {{ newlyUploadedFile }}
    </div> -->
  </main>
</template>

<style lang="scss">
.title {
  font-size: 19px;
  text-align: center;
  margin-bottom: 5px;
}
.links {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
