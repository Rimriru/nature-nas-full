<script setup lang="ts">
import type { Section, SectionFromDb } from '~/types/SectionDataFromDb';

const sections = ref<SectionFromDb[]>([]);
const sectionValues = reactive<Section>({
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
const notifications = useToast();
const removalError = '';

const props = defineProps(['sections', 'contentId']);

const onClose = () => {
  sectionIdOfInterest.value = '';
  sectionValues.title = '';
  sectionValues.content = '';
  isSectionPopupOpened.value = false;
  isEditing.value = false;
};

const onEditBtnClick = () => {
  sectionValues.title = whatSectionShown.value.title;
  sectionValues.content = whatSectionShown.value.content;
  sectionIdOfInterest.value = whatSectionShown.value._id;

  isEditing.value = true;
  isSectionPopupOpened.value = true;
};

const onRemoveBtnClick = () => {
  sectionIdOfInterest.value = whatSectionShown.value._id;
  isConfirmPopupOpened.value = true;
};

const onConfirmPopupClose = () => {
  sectionIdOfInterest.value = '';
  isConfirmPopupOpened.value = false;
};

const handleSectionRemoval = async () => {
  try {
    const { message } = await $fetch(`/api/section/${sectionIdOfInterest.value}`, {
      method: 'delete'
    });
    sections.value = sections.value.filter((section) => section._id !== sectionIdOfInterest.value);
    whatSectionShown.value = sections.value[0];
    notifications.add({ id: 'remove-sections', title: message });
    onConfirmPopupClose();
  } catch (error) {
    console.error(error);
  }
};

const handleSectionsSubmit = async () => {
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
      const newContent = await $fetch('/api/content', {
        method: 'put',
        query: {
          contentId: props.contentId,
          sectionId: newSection._id
        }
      });
      notifications.add({ id: 'add-sections', title: message });
      sections.value.push(newSection as unknown as SectionFromDb);
      onClose();
    } catch (error) {
      console.error(error);
    }
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
    } catch (error) {
      console.error(error);
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
  <div class="sections">
    <div class="sections__container">
      <ul class="sections__titles" v-if="sections.length">
        <li v-for="section in sections" :key="section._id">
          <MenuButton
            :is-active="section._id === whatSectionShown._id"
            @click="whatSectionShown = section"
          >
            {{ section.title }}
          </MenuButton>
        </li>
        <button class="sections__add-btn" @click="isSectionPopupOpened = true" type="button" />
      </ul>
      <div v-if="sections && sections.length > 0" class="sections__content">
        <article
          class="content"
          v-html="sections.find((section: SectionFromDb) => section._id === whatSectionShown._id)?.content"
        />
        <div class="sections__content-management">
          <EditBtn @click="onEditBtnClick" />
          <RemoveBtn @click="onRemoveBtnClick" />
        </div>
      </div>
    </div>
    <SectionForm
      v-model:section-values="sectionValues"
      @close="onClose"
      @submit="handleSectionsSubmit"
    />
    <ConfirmPopup
      :is-open="isConfirmPopupOpened"
      :what-is-removed="'section'"
      :removed-item-title="whatSectionShown.title"
      :error="removalError"
      @on-close="onConfirmPopupClose"
      @on-agree="handleSectionRemoval"
    />
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.sections {
  margin-block: 20px 80px;

  .sections__container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 0 auto 20px;

    .sections__titles {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;

      button {
        padding-inline: 10px;
      }
    }
  }

  .sections__content {
    border: 1px solid $mid-blue;
    border-radius: 40px;
    padding: 20px;
    position: relative;

    .sections__content-management {
      position: absolute;
      top: 20px;
      right: 25px;
      display: flex;
      gap: 10px;
    }
  }

  .sections__add-btn {
    background-image: url('../assets/images/add-btn-stretch.svg');
    background-size: 100%;
    background-repeat: no-repeat;
    width: clamp(100px, 15vw, 150px);
    height: 35px;
  }
}
</style>
