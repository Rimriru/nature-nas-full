<script setup lang="ts">
const props = defineProps(['personaData']);
</script>

<template>
  <UForm :state="props.personaData">
    <UFormGroup name="name">
      Имя (ФИО)
      <span class="required">*</span>
      <UInput v-model="props.personaData.name" />
    </UFormGroup>
    <UFormGroup name="telNumber">
      Тел.
      <UInput v-model="props.personaData.telNumber" />
    </UFormGroup>
    <UFormGroup name="faxNumber">
      Тел./факс
      <UInput v-model="props.personaData.faxNumber" />
    </UFormGroup>
    <UFormGroup name="email">
      Email
      <UInput v-model="props.personaData.email" />
    </UFormGroup>
    <UFormGroup name="description">
      Описание
      <UInput v-model="props.personaData.description" />
    </UFormGroup>
    <label for="personaPhoto">
      Загрузить фото для галереи:
      <input
        style="display: none"
        id="personaPhoto"
        type="file"
        ref="personaPhotoInput"
        accept="image/gif, image/jpeg, image/png"
        @change="(event: any) => (props.personaData.photo = event.target.files[0])"
      />
      <UButton
        color="blue"
        variant="soft"
        @click="($refs.personaPhotoInput as HTMLInputElement).click()"
      >
        Выбрать файл
      </UButton>
      <p>
        Загруженный файл:
        {{ (props.personaData.photo as File).name }}
      </p>
    </label>
  </UForm>
</template>

<style lang="scss"></style>
