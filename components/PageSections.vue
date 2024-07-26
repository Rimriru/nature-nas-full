<script setup lang="ts">
import type { ISection, SectionFromDb } from '~/types/SectionDataFromDb';
import type { ObjectId } from 'mongoose';

const sections = ref<SectionFromDb[]>([]);
const sectionValues = reactive<ISection>({
  title: '',
  content: ''
});
const sectionIdOfInterest = ref('');
const whatSectionShown = ref<SectionFromDb>({
  _id: '',
  title: '',
  content: ''
});
const isEditing = ref(false);
const isSectionPopupOpened = useSectionPopupOpeningState();
const isConfirmPopupOpened = ref(false);
const submitError = ref('');
const isSectionRemoveRequestPending = ref(false);

const isLoggedIn = useLoggedInState();
const notifications = useToast();
const isLoaderVisible = useLoaderVisibilityState();

const props = defineProps<{
  sections: SectionFromDb[];
  contentId: string | ObjectId;
  isSingle: boolean;
}>();

let sectionDataBeforeEdit = {
  title: '',
  content: ''
};

const onClose = () => {
  isSectionPopupOpened.value = false;
  isLoaderVisible.value = false;
  sectionIdOfInterest.value = '';
  sectionValues.title = '';
  sectionValues.content = '';
  sectionDataBeforeEdit = {
    title: '',
    content: ''
  };
  isEditing.value = false;
  submitError.value = '';
};

const onEditBtnClick = () => {
  sectionValues.title = whatSectionShown.value.title;
  sectionValues.content = whatSectionShown.value.content;
  sectionIdOfInterest.value = whatSectionShown.value._id;

  sectionDataBeforeEdit.title = sectionValues.title;
  sectionDataBeforeEdit.content = sectionValues.content;

  isEditing.value = true;
  isSectionPopupOpened.value = true;
};

const onRemoveBtnClick = () => {
  sectionIdOfInterest.value = whatSectionShown.value._id;
  isConfirmPopupOpened.value = true;
};

const onConfirmPopupClose = () => {
  isConfirmPopupOpened.value = false;
  sectionIdOfInterest.value = '';
  isSectionRemoveRequestPending.value = false;
  submitError.value = '';
};

const handleSectionRemoval = async () => {
  submitError.value = '';
  isSectionRemoveRequestPending.value = true;
  try {
    const { message } = await $fetch(`/api/section/${sectionIdOfInterest.value}`, {
      method: 'delete'
    });
    await $fetch(`/api/content/sections/${props.contentId}`, {
      method: 'delete',
      body: {
        sectionId: sectionIdOfInterest.value
      }
    });
    sections.value = sections.value.filter((section) => section._id !== sectionIdOfInterest.value);
    if (sections.value.length > 0) {
      whatSectionShown.value = sections.value[0];
    } else {
      whatSectionShown.value = {
        _id: '',
        title: '',
        content: ''
      };
    }
    notifications.add({ id: 'remove-sections', title: message });
    onConfirmPopupClose();
  } catch (error: any) {
    console.error(error);
    submitError.value = `${error.status}: ${error.data.message}`;
    isSectionRemoveRequestPending.value = false;
  }
};

const handleSectionsSubmit = async () => {
  submitError.value = '';
  isLoaderVisible.value = true;
  const editedSectionData = {
    title: sectionValues.title,
    content: sectionValues.content
  };
  // если мы создаём новый раздел, а не редактируем существующий
  if (!isEditing.value) {
    try {
      const { message, newSection } = await $fetch('/api/section', {
        method: 'post',
        body: editedSectionData
      });
      await $fetch(`/api/content/sections/${props.contentId}`, {
        method: 'put',
        body: {
          sectionId: newSection._id
        }
      });
      sections.value.push(newSection as unknown as SectionFromDb);
      whatSectionShown.value = newSection;
      notifications.add({ id: 'add-sections', title: message });
      onClose();
    } catch (error: any) {
      isLoaderVisible.value = false;
      submitError.value = `${error.status}: ${error.data.message}`;
      console.error(error);
    }
  } else {
    if (JSON.stringify(sectionDataBeforeEdit) === JSON.stringify(editedSectionData)) {
      onClose();
    } else {
      try {
        const { message, updatedSection } = await $fetch(
          `/api/section/${sectionIdOfInterest.value}`,
          {
            method: 'patch',
            body: editedSectionData
          }
        );

        notifications.add({ id: 'edit-sections', title: message });
        const updatedSectionFromDb = updatedSection as unknown as SectionFromDb;

        const theOldSectionIndex = sections.value.findIndex(
          (section: SectionFromDb) => section._id === sectionIdOfInterest.value
        );
        if (theOldSectionIndex !== -1) {
          sections.value[theOldSectionIndex] = updatedSectionFromDb;
          whatSectionShown.value = updatedSectionFromDb;
        }
        onClose();
      } catch (error: any) {
        isLoaderVisible.value = false;
        submitError.value = `${error.status}: ${error.data.message}`;
        console.error(error);
      }
    }
  }
};

onMounted(() => {
  if (props.sections.length > 0) {
    sections.value = props.sections;
    whatSectionShown.value = sections.value[0];
  }
});
</script>

<template>
  <div :class="[{ sections_single: props.isSingle }, 'sections']">
    <div class="sections__container">
      <ul class="sections__titles">
        <li v-for="section in sections" :key="section._id">
          <MenuButton
            :is-active="section._id === whatSectionShown._id"
            :size="'middle'"
            @click="whatSectionShown = section"
          >
            {{ section.title }}
          </MenuButton>
        </li>
        <ClientOnly>
          <button
            v-if="isLoggedIn"
            class="sections__add-btn button"
            @click="isSectionPopupOpened = true"
            type="button"
          />
        </ClientOnly>
      </ul>
      <div v-if="sections && sections.length > 0" class="sections__content">
        <article
          class="content"
          v-html="sections.find((section: SectionFromDb) => section._id === whatSectionShown._id)?.content"
        />
        <ClientOnly>
          <div class="sections__content-management">
            <EditBtn :color="'black'" @click="onEditBtnClick" />
            <RemoveBtn @click="onRemoveBtnClick" />
          </div>
        </ClientOnly>
      </div>
    </div>
    <ClientOnly>
      <LazySectionForm
        v-if="isLoggedIn"
        v-model:section-values="sectionValues"
        :is-editing="isEditing"
        :error="submitError"
        @close="onClose"
        @submit="handleSectionsSubmit"
      />
      <LazyConfirmPopup
        v-if="isLoggedIn"
        :is-open="isConfirmPopupOpened"
        :what-is-removed="'section'"
        :removed-item-title="whatSectionShown.title"
        :is-request-pending="isSectionRemoveRequestPending"
        :error="submitError"
        @on-close="onConfirmPopupClose"
        @on-agree="handleSectionRemoval"
      />
    </ClientOnly>
  </div>
</template>

<style lang="scss">
@import url('~/assets/styles/components/pageSections.scss');
</style>
