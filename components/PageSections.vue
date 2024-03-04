<script setup lang="ts">
type Section = {
  title: string;
  text: string;
};

const sections: Ref<Section[]> = ref([]);
const whatSectionShown = ref('');
const isAddSectionPopupOpened = useSectionPopupOpeningState();

const props = defineProps(['sections']);

onMounted(() => {
  if (props.sections) return (sections.value = props.sections);
});
</script>

<template>
  <div class="canvas__sections">
    <div class="canvas__sections-btns">
      <ul class="canvas__sections-titles" v-if="sections.length">
        <li v-for="{ title } in sections" :key="title">
          <MenuButton type="button" @click="() => (whatSectionShown = title)">
            {{ title }}
          </MenuButton>
        </li>
      </ul>
      <button
        class="canvas__sections-add"
        @click="isAddSectionPopupOpened = true"
        type="button"
      ></button>
    </div>
    <p class="canvas__sections-text">
      {{
        sections.length ? sections.find((section) => section.title === whatSectionShown)?.text : ''
      }}
    </p>
  </div>
</template>

<style lang="scss">
.canvas__sections {
  margin-block: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .canvas__sections-btns {
    display: flex;
    gap: 20px;
  }

  .canvas__sections-add {
    background-image: url('../assets/images/add-btn-stretch.svg');
    background-size: 100%;
    background-repeat: no-repeat;
    width: clamp(100px, 15vw, 150px);
    height: 35px;
  }
}
</style>
