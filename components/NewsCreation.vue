<script setup lang="ts">
const newsData = reactive({
  title: '',
  photo: '',
  content: ''
});

const validate = (state: any) => {
  const errors = [];
  if (!state.title)
    errors.push({ path: 'title', message: 'Поле "Заголовок" является обязательным' });
  if (!state.content)
    errors.push({ path: 'content', message: 'Поле "Содержимое" является обязательным' });
  return errors;
};
</script>

<template>
  <div class="news-creation">
    <UForm :state="newsData" :validate="validate" class="news-creation__form">
      <UFormGroup name="title">
        Заголовок новости
        <span class="required">*</span>
        <UInput v-model="newsData.title" placeholder="Введите заголовок новости..." />
      </UFormGroup>
      <UFormGroup name="cover">
        Обложка
        <span class="required">*</span>
        <UInput v-model="newsData.photo" type="file" />
      </UFormGroup>
      <UFormGroup name="content">
        Содержимое
        <span class="required">*</span>
        <ClientOnly>
          <ContentEditor
            v-model="newsData.content"
            :placeholder="'Начните печатать содержимое новости...'"
          />
        </ClientOnly>
      </UFormGroup>
      <SubmitBtn>Создать новость</SubmitBtn>
    </UForm>
  </div>
</template>

<style lang="scss">
.news-creation {
  .news-creation__form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}
</style>
