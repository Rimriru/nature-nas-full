<script setup lang="ts">
import { fileSizeError } from '~/utils/errorMessages';
import defaultCover from '~/assets/images/journal-preview-default.jpg';
import type { Form, FormError } from '#ui/types';

const journalData = reactive({
  description: '',
  cover: '',
  editChief: '',
  editBoard: '',
  editInternatBoard: '',
  authorRules: {
    _id: '',
    name: '',
    file: ''
  },
  editorialPolicy: {
    _id: '',
    name: '',
    file: ''
  },
  publications: [
    {
      _id: '',
      name: '',
      file: ''
    }
  ],
  contacts: {
    address: '',
    telNumber: '',
    email: ''
  }
});
const journalForm = ref<Form<string> | null>(null);
const journalCoverInput = ref<HTMLInputElement | null>(null);
const journalCoverForPreview = ref('');
const journalCoverOnUpload = ref<File | ''>('');
const journalCoverError = ref('');

const props = defineProps<{
  isOpen: boolean;
}>();
const emit = defineEmits(['close']);
const journalState = useJournalState();
const filesState = useFilesState();
const config = useRuntimeConfig();

const selectedAuthorRules = ref(filesState.value[0]);
const selectedEditorialPolicy = ref(filesState.value[0]);

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue && journalState.value) {
      journalForm.value?.clear();
      journalData.description = journalState.value.description;
      journalData.editChief = journalState.value.editChief;
      journalData.editBoard = journalState.value.editBoard;
      journalData.editInternatBoard = journalState.value.editInternatBoard;
      journalData.authorRules = journalState.value.authorRules;
      selectedAuthorRules.value = journalState.value.authorRules;

      journalData.editorialPolicy = journalState.value.editorialPolicy;
      selectedEditorialPolicy.value = journalState.value.editorialPolicy;
      journalData.publications = journalState.value.publications;

      journalData.contacts.address = journalState.value.contacts.address;
      journalData.contacts.telNumber = journalState.value.contacts.telNumber;
      journalData.contacts.email = journalState.value.contacts.email;

      journalData.cover = journalState.value.cover;
      journalCoverForPreview.value = `${config.public.domen}/image/${journalState.value.cover}`;
      console.log(journalData);
    } else {
      if (journalCoverInput.value) {
        journalCoverInput.value.value = '';
      }
      journalCoverError.value = '';
    }
  }
);

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.description)
    errors.push({ path: 'description', message: 'Поле "Описание" является обязательным' });
  if (!state.editChief)
    errors.push({ path: 'chief', message: 'Поле "Главный редактор" является обязательным' });
  if (!state.editBoard)
    errors.push({ path: 'board', message: 'Поле "Редакционная коллегия" является обязательным' });
  if (!state.editInternatBoard)
    errors.push({
      path: 'intBoard',
      message: 'Поле "Международный редакционный совет" является обязательным'
    });
  if (!state.contacts.address)
    errors.push({ path: 'address', message: 'Поле "Адрес" является обязательным' });
  if (!state.contacts.telNumber)
    errors.push({ path: 'telNumber', message: 'Поле "Номер телефона" является обязательным' });
  if (!state.contacts.email)
    errors.push({ path: 'email', message: 'Поле "Email" является обязательным' });
  return errors;
};

const onJournalCoverInputChange = (event: Event) => {
  journalCoverForPreview.value = '';
  const fileInputData = event.target as HTMLInputElement;
  if (fileInputData.files && fileInputData.files.length) {
    const file = fileInputData.files[0];
    if (file.size > 5000000) return (journalCoverError.value = fileSizeError('5'));
    journalCoverOnUpload.value = file;
    journalCoverForPreview.value = URL.createObjectURL(file);
    console.log(journalCoverOnUpload.value);
  } else {
    journalCoverOnUpload.value = '';
  }
};
</script>

<template>
  <AppPopup :is-opened="isOpen" @on-close="emit('close')">
    <UForm :state="journalData" :validate="validate" class="journal-form" ref="journalForm">
      <h5 class="journal-form__title">Редактировать журнал "Природопользование"</h5>
      <ClientOnly>
        <UFormGroup name="description">
          Описание
          <span class="required">*</span>
          <ContentEditor
            :placeholder="'Начните печатать описание...'"
            v-model="journalData.description"
          />
        </UFormGroup>
      </ClientOnly>
      <div>
        Обложка <span class="required">*</span>
        <div class="journal-form__cover">
          <div
            :style="{
              backgroundImage: `url(${
                journalCoverForPreview ? journalCoverForPreview : defaultCover
              })`
            }"
            class="journal-form__cover-preview"
          ></div>
          <div class="journal-form__cover-input">
            <label>
              Загрузить:
              <input
                style="display: none"
                id="journalCover"
                type="file"
                ref="journalCoverInput"
                accept="image/jpeg, image/png"
                @change="onJournalCoverInputChange"
              />
              <LoadButton @on-click="($refs.journalCoverInput as HTMLInputElement).click()" />
            </label>
            <span v-if="journalCoverError" class="error">{{ journalCoverError }}</span>
          </div>
        </div>
      </div>
      <UFormGroup name="chief">
        Главный редактор
        <span class="required">*</span>
        <UTextarea
          :placeholder="'Напишите главного редактора...'"
          v-model="journalData.editChief"
          :resize="true"
        />
      </UFormGroup>
      <UFormGroup name="board">
        Редакционная коллегия
        <span class="required">*</span>
        <UTextarea
          :placeholder="'Напишите редакционную коллегию...'"
          v-model="journalData.editBoard"
          :resize="true"
        />
      </UFormGroup>
      <UFormGroup name="intBoard">
        Международный редакционный совет
        <span class="required">*</span>
        <UTextarea
          :placeholder="'Напишите международный редакционный совет...'"
          v-model="journalData.editInternatBoard"
          :resize="true"
        />
      </UFormGroup>
      <section class="journal-form__files">
        <p class="journal-form__files-title">
          Правила для авторов
          <span class="required">*</span>
        </p>
        <div>
          <p class="journal-form__file-current">Что установлено сейчас:</p>
          <p class="journal-form__file-data">
            {{ `название: ${journalData.authorRules.name}` }}
          </p>
          <p class="journal-form__file-data">
            {{ `ссылка: ${$config.public.domen}/file/${journalData.authorRules.file}` }}
          </p>
        </div>
        <div>
          <UFormGroup>
            Выбрать загруженный файл:
            <UInputMenu
              v-model="selectedAuthorRules"
              :options="filesState"
              by="_id"
              option-attribute="name"
              :search-attributes="['name']"
            />
          </UFormGroup>
        </div>
      </section>
      <section class="journal-form__files">
        <p class="journal-form__files-title">
          Редакционная политика
          <span class="required">*</span>
        </p>
        <div>
          <p class="journal-form__file-current">Что установлено сейчас:</p>
          <p class="journal-form__file-data">
            {{ `название: ${journalData.editorialPolicy.name}` }}
          </p>
          <p class="journal-form__file-data">
            {{ `ссылка: ${$config.public.domen}/file/${journalData.editorialPolicy.file}` }}
          </p>
        </div>
        <div>
          <UFormGroup>
            Выбрать загруженный файл:
            <UInputMenu
              v-model="selectedEditorialPolicy"
              :options="filesState"
              by="_id"
              option-attribute="name"
              :search-attributes="['name']"
            />
          </UFormGroup>
        </div>
      </section>
      <UFormGroup name="address">
        Адрес
        <span class="required">*</span>
        <UInput v-model="journalData.contacts.address" />
      </UFormGroup>
      <UFormGroup name="telNumber">
        Номер телефона
        <span class="required">*</span>
        <UInput v-model="journalData.contacts.telNumber" />
      </UFormGroup>
      <UFormGroup name="email">
        Email
        <span class="required">*</span>
        <UInput v-model="journalData.contacts.email" />
      </UFormGroup>
      <div class="journal-form__btn-container">
        <MenuButton :size="'middle'" :button-type="'submit'">Отмена</MenuButton>
        <MenuButton :is-active="true" :size="'middle'" :button-type="'submit'"
          >Сохранить</MenuButton
        >
      </div>
    </UForm>
  </AppPopup>
</template>

<style lang="scss">
.journal-form {
  display: grid;
  gap: 20px;

  .journal-form__title {
    text-align: center;
    font-size: 18px;
  }

  .journal-form__cover {
    display: flex;
    gap: 30px;

    .journal-form__cover-preview {
      width: 300px;
      height: 400px;
      margin-bottom: 10px;
      background-size: 100% 100%;
      border-radius: 10px;
    }

    .journal-form__cover-input {
      display: grid;
      align-content: center;
    }
  }

  .journal-form__files {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .journal-form__files-title {
      font-size: 17px;
    }

    .journal-form__file-current {
      text-decoration: underline;
    }

    .journal-form__file-data {
      display: block;
    }
  }

  .journal-form__btn-container {
    display: flex;
    gap: 20px;
    justify-content: center;
  }
}
</style>
