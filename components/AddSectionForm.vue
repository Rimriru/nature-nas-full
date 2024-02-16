<script setup lang="ts">
const sectionTitle = ref('');
const sectionText = ref('');
const isAddSectionPopupOpened = usePopupOpeningState();
</script>

<template>
  <AppPopup>
    <form class="section-form" novalidate>
      <h2 class="section-form__heading">Добавить новую секцию</h2>
      <label class="section-form__label">
        Заголовок секции
        <span class="required">*</span>
        <input type="text" placeholder="Напишите заголовок" v-model="sectionTitle" />
      </label>
      <label class="section-form__label">
        Содержимое
        <span class="required">*</span>
        <ContentEditor v-model="sectionText" :output="'text'" />
      </label>
      <div class="section-form__btns">
        <button type="button" @click="isAddSectionPopupOpened = false">Закрыть</button>
        <button type="submit">Добавить</button>
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
