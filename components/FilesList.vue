<script setup lang="ts">
import type { FileDataFromDb } from '~/types/FilesDataFromDb';

interface TableRow extends FileDataFromDb {
  number: number;
  link: string;
}

const props = defineProps<{
  filesList: FileDataFromDb[];
  isForImages: boolean;
}>();

const emit = defineEmits(['onFileRemove']);

const isFileEditFormPopupOpen = ref(false);
const isConfirmPopupOpen = ref(false);
const fileOfInterest = ref<FileDataFromDb | ''>('');
const removeFileError = ref('');
const notifications = useToast();
const config = useRuntimeConfig();

const query = ref('');
const page = ref(1);
const pageCount = 10;

const columns = [
  {
    key: 'number',
    label: '#'
  },
  {
    key: 'name',
    label: 'Название',
    sortable: true
  },
  {
    key: 'link',
    label: 'Ссылка',
    sortable: true
  },
  {
    key: 'actions',
    label: 'Действия'
  }
];

const files = computed(() => {
  const f = props.filesList
    .map((file, index) => {
      return {
        _id: file._id,
        name: file.name,
        file: file.file,
        number: index + 1,
        link: `${
          config.public.process === 'production' ? config.public.prodDomen : config.public.devDomen
        }/${props.isForImages ? 'image' : 'file'}/${file.file}`
      };
    })
    .reverse() as TableRow[];

  if (!query.value) {
    return f.slice((page.value - 1) * pageCount, page.value * pageCount);
  }

  return f.filter((file) => {
    return file.name.toLowerCase().includes(query.value.toLowerCase());
  });
});

const actions = (row: any) => [
  [
    {
      label: 'Редактировать',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => onEditBtnClick(row)
    },
    {
      label: 'Удалить',
      icon: 'i-heroicons-trash-20-solid',
      click: () => onRemoveBtnClick(row)
    }
  ]
];

const onEditBtnClick = (fileData: TableRow) => {
  fileOfInterest.value = { _id: fileData._id, name: fileData.name, file: fileData.file };
  isFileEditFormPopupOpen.value = true;
};

const resetFileOfInterest = () => {
  fileOfInterest.value = '';
};

const closeEditFormPopup = () => {
  isFileEditFormPopupOpen.value = false;
  resetFileOfInterest();
};

const onRemoveBtnClick = (fileData: TableRow) => {
  fileOfInterest.value = { _id: fileData._id, name: fileData.name, file: fileData.file };
  isConfirmPopupOpen.value = true;
};

const onConfirmPopupClose = () => {
  isConfirmPopupOpen.value = false;
  removeFileError.value = '';
  resetFileOfInterest();
};

const handleFileRemove = async () => {
  try {
    if (fileOfInterest.value) {
      const fileId = fileOfInterest.value._id;
      // @ts-ignore
      const { message } = await $fetch(`/api/files/${fileId}`, {
        method: 'delete',
        query: {
          image: props.isForImages ? true : false
        }
      });

      emit('onFileRemove', fileId);

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
    <div>
      <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
        <UInput
          v-model="query"
          placeholder="Найти файл по имени..."
          class="basis-1/2"
          icon="i-heroicons-magnifying-glass-20-solid"
        />
      </div>
      <UTable
        :columns="columns"
        :rows="files"
        :sort-button="{
          color: 'blue',
          variant: 'outline',
          size: '2xs',
          square: false
        }"
        :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'Не найдено' }"
        :ui="{
          td: {
            base: 'whitespace-normal',
            color: 'text-black',
            padding: 'px-2 py-2'
          }
        }"
        class="w-full"
      >
        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>
      </UTable>
      <div
        v-if="!query"
        class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
      >
        <UPagination
          v-model="page"
          :max="7"
          :page-count="pageCount"
          :total="props.filesList.length"
          show-last
          show-first
        />
      </div>
    </div>
    <LazyFileNameEditFormPopup
      :is-open="isFileEditFormPopupOpen"
      :file-data="fileOfInterest"
      @close="closeEditFormPopup"
    />
    <LazyConfirmPopup
      :is-open="isConfirmPopupOpen"
      :what-is-removed="'file'"
      :removedItemTitle="fileOfInterestName"
      :error="removeFileError"
      @on-close="onConfirmPopupClose"
      @on-agree="handleFileRemove"
    />
  </div>
</template>

<style lang="scss">
@import url('~/assets/styles/components/list.scss');
</style>
