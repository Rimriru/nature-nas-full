<script setup lang="ts">
import type { Form, FormError } from '#ui/types';
import type { DefineComponent } from 'vue';

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
  contacts: {
    address: '',
    telNumber: '',
    email: ''
  }
});
const journalForm = ref<Form<string> | null>(null);
const journalCoverInput = ref<DefineComponent | null>(null);
const journalCoverForPreview = ref('');
const journalCoverAsFile = ref<File | ''>('');
const journalCoverAsLink = ref('');
const journalCoverErrorsVisibility = ref({
  requiredError: false,
  linkValidationError: false,
  fileSizeError: false
});
const submitError = ref('');

const props = defineProps<{
  isOpen: boolean;
}>();
const emit = defineEmits(['close']);
const journalState = useJournalState();
const filesState = useFilesState();
const notifications = useToast();

const selectedAuthorRules = ref(filesState.value[0]);
const selectedEditorialPolicy = ref(filesState.value[0]);

let originalJournalData = {
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
  contacts: {
    address: '',
    telNumber: '',
    email: ''
  }
};

const resetErrors = () => {
  submitError.value = '';
  journalCoverErrorsVisibility.value = {
    requiredError: false,
    linkValidationError: false,
    fileSizeError: false
  };
};

const resetCoverFileInputValue = () => {
  if (journalCoverInput.value) {
    journalCoverInput.value.coverImageInput.value = '';
  }
};

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue && journalState.value) {
      journalForm.value?.clear();
      const {
        description,
        cover,
        editChief,
        editBoard,
        editInternatBoard,
        authorRules,
        editorialPolicy,
        contacts: { address, telNumber, email }
      } = journalState.value;
      journalData.description = description;
      journalData.editChief = editChief;
      journalData.editBoard = editBoard;
      journalData.editInternatBoard = editInternatBoard;
      journalData.authorRules = authorRules;
      selectedAuthorRules.value = authorRules;

      journalData.editorialPolicy = editorialPolicy;
      selectedEditorialPolicy.value = editorialPolicy;

      journalData.contacts.address = address;
      journalData.contacts.telNumber = telNumber;
      journalData.contacts.email = email;

      journalData.cover = cover;
      journalCoverForPreview.value = IMAGE_LINK_REG_EXP.test(cover) ? cover : `/image/${cover}`;

      originalJournalData = {
        description,
        cover,
        editChief,
        editBoard,
        editInternatBoard,
        authorRules,
        editorialPolicy,
        contacts: {
          address,
          telNumber,
          email
        }
      };
    } else {
      resetCoverFileInputValue();
      journalCoverAsFile.value = '';
      journalCoverAsLink.value = '';
      resetErrors();
      originalJournalData = {
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
        contacts: {
          address: '',
          telNumber: '',
          email: ''
        }
      };
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
  resetErrors();
  journalCoverAsLink.value = '';
  journalCoverForPreview.value = '';

  const fileInputData = event.target as HTMLInputElement;
  if (fileInputData.files && fileInputData.files.length) {
    const file = fileInputData.files[0];
    if (file.size > 5000000) return (journalCoverErrorsVisibility.value.fileSizeError = true);
    journalCoverAsFile.value = file;
    journalCoverForPreview.value = URL.createObjectURL(file);
  } else {
    journalCoverAsFile.value = '';
  }
};

const onJournalCoverLinkChange = () => {
  journalCoverAsFile.value = '';
  resetCoverFileInputValue();
  resetErrors();

  if (!IMAGE_LINK_REG_EXP.test(journalCoverAsLink.value)) {
    journalCoverForPreview.value = '';
    journalCoverErrorsVisibility.value.linkValidationError = true;
    return;
  }
  journalCoverForPreview.value = journalCoverAsLink.value;
};

const onJournalFormSubmit = async () => {
  submitError.value = '';

  if (journalCoverAsLink.value && journalCoverAsLink.value !== journalData.cover) {
    const initialCover = journalData.cover;
    journalData.cover = journalCoverAsLink.value;
    journalCoverAsLink.value = '';

    if (initialCover && !IMAGE_LINK_REG_EXP.test(initialCover)) {
      await $fetch(`/api/images/${initialCover}`, {
        method: 'delete',
        onResponse({ response }) {
          if (!response.ok) {
            notifications.add({
              id: 'news',
              title: String(response.status),
              description: response.statusText
            });
            return;
          }
        }
      });
    }
  }

  if (journalCoverAsFile.value) {
    const body = new FormData();
    body.append('images', journalCoverAsFile.value);
    await $fetch('/api/images', {
      method: 'post',
      body,
      async onResponse({ response }) {
        if (response.ok) {
          const previousCoverFile = !IMAGE_LINK_REG_EXP.test(journalData.cover)
            ? journalData.cover
            : '';
          journalData.cover = response._data[0];
          journalCoverAsFile.value = '';
          resetCoverFileInputValue();

          if (previousCoverFile) {
            await $fetch(`/api/images/${previousCoverFile}`, {
              method: 'delete',
              onResponse({ response }) {
                if (!response.ok) {
                  notifications.add({
                    id: 'mgraphs',
                    title: String(response.status),
                    description: response.statusText
                  });
                  return;
                }
              }
            });
          }
        } else {
          notifications.add({
            id: 'journal',
            title: String(response.status),
            description: response.statusText
          });
          resetCoverFileInputValue();
          return;
        }
      }
    });
  }

  if (JSON.stringify(journalData.authorRules) !== JSON.stringify(selectedAuthorRules.value)) {
    journalData.authorRules = selectedAuthorRules.value;
  }

  if (
    JSON.stringify(journalData.editorialPolicy) !== JSON.stringify(selectedEditorialPolicy.value)
  ) {
    journalData.editorialPolicy = selectedEditorialPolicy.value;
  }

  if (JSON.stringify(originalJournalData) === JSON.stringify(journalData)) {
    emit('close');
  } else {
    const journalId = journalState.value?._id;

    try {
      const editedJournalData = await $fetch(`/api/journal/${journalId}`, {
        method: 'patch',
        body: journalData
      });
      journalState.value = editedJournalData;
      notifications.add({ id: 'journal', title: 'Данные журнала были изменены!' });
      emit('close');
    } catch (error: any) {
      notifications.add({ id: 'journal', title: error.status, description: error.data.message });
      submitError.value = `${error.status}: ${error.data.message}`;
      console.error(error);
    }
  }
};
</script>

<template>
  <AppPopup :is-opened="isOpen" @on-close="emit('close')">
    <UForm
      :state="journalData"
      :validate="validate"
      class="journal-form"
      ref="journalForm"
      @submit="onJournalFormSubmit"
    >
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
      <CoverFormBlock
        ref="journalCoverInput"
        v-model="journalCoverAsLink"
        :cover-error-visibility="journalCoverErrorsVisibility"
        :cover-preview="journalCoverForPreview"
        :cover-size-limit="'5'"
        :centered="true"
        :vertical="true"
        @on-cover-input-change="onJournalCoverInputChange"
        @on-cover-link-change="onJournalCoverLinkChange"
      />
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
            {{
              `ссылка: ${
                $config.public.process === 'production'
                  ? $config.public.prodDomen
                  : $config.public.devDomen
              }/file/${journalData.authorRules.file}`
            }}
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
            {{
              `ссылка: ${
                $config.public.process === 'production'
                  ? $config.public.prodDomen
                  : $config.public.devDomen
              }/file/${journalData.editorialPolicy.file}`
            }}
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
        <MenuButton :size="'middle'" :button-type="'submit'" @click="emit('close')"
          >Отмена</MenuButton
        >
        <MenuButton
          :is-active="true"
          :size="'middle'"
          :button-type="'submit'"
          :is-disabled="
            journalCoverErrorsVisibility.fileSizeError ||
            journalCoverErrorsVisibility.linkValidationError ||
            journalCoverErrorsVisibility.requiredError
          "
          >Сохранить</MenuButton
        >
      </div>
    </UForm>
  </AppPopup>
</template>

<style lang="scss">
@import '~/assets/styles/components/journalFormPopup.scss';
@import '~/assets/styles/components/newsForm.scss';
</style>
