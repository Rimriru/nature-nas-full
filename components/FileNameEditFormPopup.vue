<script setup lang="ts">
import type { Form, FormError } from '#ui/types';
import type FileDataFromDb from '~/types/FilesDataFromDb';

const fileName = reactive({
  name: ''
});
const fileForm = ref<Form<string> | null>(null);
const fileDataForEditing = ref({
  _id: '',
  name: ''
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.name) errors.push({ path: 'name', message: 'Поле "Название" является обязательным' });
  return errors;
};

const props = defineProps<{
  isOpen: boolean;
  fileData: FileDataFromDb | '';
}>();
const emit = defineEmits(['close']);

const filesState = useFilesState();
const notifications = useToast();

watch(
  () => props.fileData,
  (newValue) => {
    if (newValue) {
      const { _id, name, file } = newValue;
      fileDataForEditing.value = {
        _id,
        name
      };
      fileName.name = name;
    } else {
      fileDataForEditing.value = {
        _id: '',
        name: ''
      };
      fileName.name = '';
    }
  },
  { deep: true }
);

const handlePopupClose = () => {
  fileForm.value?.clear();
  fileName.name = '';
  emit('close');
};

const handleEditFileFormSubmit = async () => {
  const originalName = fileDataForEditing.value.name;
  const editedFileBody = {
    name: fileName.name
  };
  try {
    if (originalName === editedFileBody.name) {
      handlePopupClose();
    } else {
      const editedFile = await $fetch(`/api/files/${fileDataForEditing.value._id}`, {
        method: 'patch',
        body: editedFileBody
      });
      const fileIndex = filesState.value.findIndex(
        (file) => file._id === fileDataForEditing.value._id
      );
      filesState.value[fileIndex] = editedFile as FileDataFromDb;
      handlePopupClose();
      notifications.add({
        id: 'file',
        title: `Файл "${fileDataForEditing.value.name}" был отредактирован`
      });
    }
  } catch (error: any) {
    notifications.add({ id: 'file', title: `${error.statusCode}: ${error.data.message}` });
    console.error(error);
  }
};
</script>

<template>
  <AppPopup :is-opened="isOpen" @on-close="handlePopupClose">
    <UForm
      :state="fileName"
      :validate="validate"
      ref="fileForm"
      @submit="handleEditFileFormSubmit"
      class="file-edit-form"
    >
      <h2>Редактировать файл</h2>
      <UFormGroup name="name">
        Название
        <span class="required">*</span>
        <UTextarea v-model="fileName.name" />
      </UFormGroup>
      <div class="file-edit-form__btn-container">
        <MenuButton :size="'small'" @click="handlePopupClose">Отмена</MenuButton>
        <MenuButton :is-active="true" :size="'small'" :button-type="'submit'"
          >Редактировать</MenuButton
        >
      </div>
    </UForm>
  </AppPopup>
</template>

<style lang="scss">
.file-edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .file-edit-form__btn-container {
    display: flex;
    gap: 10px;
  }
}
</style>
