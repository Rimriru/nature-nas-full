<script setup lang="ts">
import { HEADER_LINK_GROUPS } from '~/utils/constants';
import type { Link } from '~/types/LinkDataFromDb';
import type { Form } from '#ui/types';

const linkData = reactive({
  title: '',
  path: ''
});
const linkId = ref('');
const isEditLinkPopupOpened = ref(false);
const editLinkError = ref('');
const editLinkForm: Ref<Form<string> | null> = ref(null);
const links = useLinksState();

const props = defineProps(['isInAdminPage']);

const onEditLinkClick = (id: string, title: string, to: string) => {
  linkData.title = title;
  linkData.path = to;
  linkId.value = id;
  isEditLinkPopupOpened.value = true;
};

const resetFormFields = () => {
  linkData.title = '';
  linkData.path = '';

  if (editLinkForm?.value) return editLinkForm.value.clear();
};

const onCloseLinkForm = () => {
  resetFormFields();
  isEditLinkPopupOpened.value = false;
  editLinkError.value = '';
};

const onEditLinkFormMount = (form: Form<string>) => {
  editLinkForm.value = form;
};

const onEditLinkFormSubmit = async () => {
  const { data, error } = await useFetch(`/api/links/${linkId.value}`, {
    method: 'patch',
    body: {
      title: linkData.title,
      to: linkData.path
    }
  });
  if (data.value) {
    const editedLinkIndex = links.value.findIndex((link) => link._id === data.value?._id);
    links.value[editedLinkIndex] = data.value as Link;
    onCloseLinkForm();
  } else {
    editLinkError.value = error.value?.data.message;
  }
};
</script>

<template>
  <div>
    <ul class="links-list">
      <li v-for="group of HEADER_LINK_GROUPS" :key="group.id">
        <p class="links-list__title">
          <Icon :icon="group.icon" />
          <span>
            {{ group.title }}
          </span>
        </p>
        <ul class="links-list__links">
          <LinksMenuItem
            :links-array="links"
            :group="group.group"
            :is-in-admin-page="props.isInAdminPage"
            @on-edit="onEditLinkClick"
          />
        </ul>
      </li>
    </ul>
    <LazyLinkForm
      :link-value="linkData"
      :is-opened="isEditLinkPopupOpened"
      :place="'link-list'"
      @on-close="onCloseLinkForm"
      @on-submit="onEditLinkFormSubmit"
      @on-mount="onEditLinkFormMount"
    />
  </div>
</template>

<style lang="scss">
.links-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 15vw;

  .links-list__title {
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 16px;

    span {
      font-weight: 600;
    }
  }

  .links-list__links {
    padding-left: 60px;
    list-style: disc;
  }
}
</style>
