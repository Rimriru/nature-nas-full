<script setup lang="ts">
import type { Section, SectionFromDb } from '~/types/SectionDataFromDb';

const sections = ref<SectionFromDb[]>([]);
const sectionValues = reactive<Section>({
  title: '',
  content: ''
});
const sectionIdOfInterest = ref('');
const whatSectionShown = ref('');
const isEditing = ref(false);
const isAddSectionPopupOpened = useSectionPopupOpeningState();
const notifications = useToast();

const props = defineProps(['sections', 'contentId']);

const onClose = () => {
  sectionIdOfInterest.value = '';
  sectionValues.title = '';
  sectionValues.content = '';
  isAddSectionPopupOpened.value = false;
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
      notifications.add({ id: 'sections', title: message });
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

      notifications.add({ id: 'sections', title: message });
      const theOldSectionIndex = sections.value.findIndex(
        (section: SectionFromDb) => section._id === sectionIdOfInterest.value
      );
      if (theOldSectionIndex)
        return (sections.value[theOldSectionIndex] = updatedSection as unknown as SectionFromDb);
      onClose();
    } catch (error) {
      console.error(error);
    }
  }
};

onMounted(() => {
  if (props.sections) return (sections.value = props.sections);
});
</script>

<template>
  <div class="sections">
    <div class="sections__btns">
      <ul class="sections__titles" v-if="sections.length">
        <li v-for="{ title } in sections" :key="title">
          <MenuButton type="button" @click="() => (whatSectionShown = title)">
            {{ title }}
          </MenuButton>
        </li>
      </ul>
      <button class="sections__add-btn" @click="isAddSectionPopupOpened = true" type="button" />
    </div>
    <p class="sections__content">
      {{
        sections && sections.length > 0
          ? sections.find((section: SectionFromDb) => section.title === whatSectionShown)
          : ''
      }}
    </p>
    <SectionForm
      v-model:section-values="sectionValues"
      @close="onClose"
      @submit="handleSectionsSubmit"
    />
  </div>
</template>

<style lang="scss">
.sections {
  margin-block: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .sections__btns {
    display: flex;
    gap: 20px;
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
