<script setup lang="ts">
const sectionTitle = ref('');
const sectionText = ref('');
const isAddSectionPopupOpened = usePopupOpeningState();

const resetFormFields = () => {
  sectionTitle.value = '';
  sectionText.value = '';
};

const handleCloseBtnClick = () => {
  isAddSectionPopupOpened.value = false;
  resetFormFields();
};

const handleSubmit = (values: any) => {
  console.log(JSON.stringify(values, null, 2));
};
</script>

<template>
  <AppPopup>
    <form class="section-form" @submit="handleSubmit" novalidate>
      <h2 class="section-form__heading">Добавить новую секцию</h2>

      <label for="title" class="section-form__label">
        Заголовок секции
        <span class="required">*</span>
        <input name="title" type="text" />
      </label>

      <label for="text" class="section-form__label">
        Содержимое
        <span class="required">*</span>
        <ClientOnly>
          <ContentEditor name="text" v-model="sectionText" />
        </ClientOnly>
      </label>

      <div class="section-form__btns">
        <MenuButton @click="handleCloseBtnClick" :is-small="true">Закрыть</MenuButton>
        <MenuButton :is-active="true" :button-type="'submit'" :is-small="true">Добавить</MenuButton>
      </div>
    </form>
  </AppPopup>
</template>

<style lang="scss">
.section-form {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .section-form__heading {
    text-align: center;
  }

  .section-form__label {
    display: block;

    input {
      border-radius: 10px;
      border: lightgray 1px solid;
      outline: none;
      padding: 8px;
      font-size: 15px;
      width: 100%;
    }
  }

  .section-form__btns {
    display: flex;
    gap: 15px;
    margin: 0 auto;
  }
}
</style>
