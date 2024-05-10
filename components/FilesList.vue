<script setup lang="ts">
import type FileDataFromDb from '~/types/FilesDataFromDb';

const isFileEditFormPopupOpen = ref(false);
const isConfirmPopupOpen = ref(false);
const fileOfInterest = ref<FileDataFromDb | ''>('');
const removeFileError = ref('');
const filesState = useFilesState();
const notifications = useToast();

const onEditBtnClick = (fileData: FileDataFromDb) => {
  fileOfInterest.value = fileData;
  isFileEditFormPopupOpen.value = true;
};

const resetFileOfInterest = () => {
  fileOfInterest.value = '';
};

const closeEditFormPopup = () => {
  isFileEditFormPopupOpen.value = false;
  resetFileOfInterest();
};

const onRemoveBtnClick = (fileData: FileDataFromDb) => {
  fileOfInterest.value = fileData;
  isConfirmPopupOpen.value = true;
};

const onConfirmPopupClose = () => {
  isConfirmPopupOpen.value = false;
  resetFileOfInterest();
};

const handleFileRemove = async () => {
  try {
    if (fileOfInterest.value) {
      const fileId = fileOfInterest.value._id;
      const { message }: { message: string } = await $fetch(`/api/files/${fileId}`, {
        method: 'delete'
      });

      filesState.value = filesState.value.filter((file) => file._id !== fileId);

      onConfirmPopupClose();
      notifications.add({
        id: 'file',
        title: message
      });
    }
  } catch (error: any) {
    removeFileError.value = `${error.status}: ${error.data.message}`;
    console.error(error);
  }
};

const fileOfInterestName = computed(() => {
  return fileOfInterest.value ? fileOfInterest.value.name : '';
});
</script>

<template>
  <div class="list">
    Список загруженных вами файлов:
    <table class="list__table">
      <thead>
        <tr>
          <th>№</th>
          <th>Имя</th>
          <th>Ссылка</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="({ _id, name, file }, index) of filesState" :key="_id">
          <td>{{ index + 1 }}</td>
          <td>{{ name }}</td>
          <td>{{ `${$config.public.domen}/file/${file}` }}</td>
          <td>
            <EditBtn :color="'black'" @click="onEditBtnClick({ _id, name, file })" />
            <RemoveBtn @click="onRemoveBtnClick({ _id, name, file })" />
          </td>
        </tr>
      </tbody>
    </table>
    <LazyFileNameEditFormPopup
      :is-open="isFileEditFormPopupOpen"
      :file-data="fileOfInterest"
      @close="closeEditFormPopup"
    />
    <LazyConfirmPopup
      :is-open="isConfirmPopupOpen"
      :what-is-removed="'file'"
      :removedItemTitle="fileOfInterestName"
      @on-close="onConfirmPopupClose"
      @on-agree="handleFileRemove"
    />
  </div>
</template>

<style lang="scss">
@import url('~/assets/styles/components/list.scss');
</style>
