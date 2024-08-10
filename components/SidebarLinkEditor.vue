<script setup lang="ts">
import type { Link, SidebarLink, LinkGroup } from '~/types/LinkDataFromDb';

const linkValues = reactive({
  title: '',
  to: ''
});
const linkIdOfInterest = ref('');
const isLinkFormPopupOpen = ref(false);
const isConfirmPopupOpen = ref(false);
const isEditing = ref(false);
const isRequestPending = ref(false);
const requestError = ref('');
let originalLinkValues = {
  title: '',
  to: ''
};

type Page = 'monographs' | 'antarctic-research';

const props = defineProps<{
  page: Page;
  links: SidebarLink[] | Link[] | undefined;
  group: LinkGroup | undefined;
}>();
const emit = defineEmits<{
  onAddNewLink: [newLink: Link];
  onEditLink: [editedLinkId: string, editedLink: Link];
  onRemoveLink: [linkId: string, linkTo: string];
}>();
const notifications = useToast();
const isLoggedIn = useLoggedInState();

const onAddLinkBtnClick = () => {
  isEditing.value = false;
  isLinkFormPopupOpen.value = true;
};

const onEditLinkBtnClick = (linkId: string, linkTitle: string, linkTo: string) => {
  isEditing.value = true;
  linkIdOfInterest.value = linkId;
  linkValues.title = linkTitle;
  linkValues.to = linkTo;
  originalLinkValues = {
    title: linkTitle,
    to: linkTo
  };
  isLinkFormPopupOpen.value = true;
};

const onRemoveLinkButtonClick = (linkId: string, linkTitle: string, linkTo: string) => {
  linkIdOfInterest.value = linkId;
  linkValues.title = linkTitle;
  linkValues.to = linkTo;
  isConfirmPopupOpen.value = true;
};

const resetValues = () => {
  linkValues.title = '';
  linkValues.to = '';
  linkIdOfInterest.value = '';
  requestError.value = '';
  isRequestPending.value = false;
};

const onLinkFormPopupClose = () => {
  isLinkFormPopupOpen.value = false;
  resetValues();
  isEditing.value = false;
  originalLinkValues = {
    title: '',
    to: ''
  };
};

const onConfirmPopupClose = () => {
  isConfirmPopupOpen.value = false;
  resetValues();
};

const handleAddLinkFormSubmit = async () => {
  isRequestPending.value = true;

  const groupId = props.group?._id;
  const newLinkBody = {
    title: linkValues.title,
    to: linkValues.to,
    groupId,
    type: props.page === 'monographs' ? 'param' : ''
  };

  try {
    const newLink = await $fetch('/api/links', {
      method: 'post',
      body: newLinkBody
    });
    emit('onAddNewLink', newLink.newLinkTyped);
    onLinkFormPopupClose();
    notifications.add({
      id: 'sidebar-editor',
      title: `Новая ссылка "${newLinkBody.title}" создана!`
    });
  } catch (error: any) {
    console.error(error);
    isRequestPending.value = false;
    requestError.value = `${error.status}: ${error.data.message}`;
  }
};

const handleEditLinkFormSubmit = async () => {
  isRequestPending.value = true;

  const editedLinkId = linkIdOfInterest.value;
  const commonLinkValues = {
    title: linkValues.title,
    to: linkValues.to
  };
  const editedLinkBody = {
    ...commonLinkValues,
    type: props.page === 'monographs' ? 'param' : ''
  };

  if (JSON.stringify(originalLinkValues) === JSON.stringify(commonLinkValues)) {
    onLinkFormPopupClose();
  } else {
    try {
      const editedLink = await $fetch(`/api/links/${editedLinkId}`, {
        method: 'patch',
        body: editedLinkBody
      });

      if (editedLink) {
        emit('onEditLink', editedLinkId, editedLink);
      }
      notifications.add({
        id: 'sidebar-editor',
        title: `Ссылка "${originalLinkValues.title}" была изменена!`
      });
      onLinkFormPopupClose();
    } catch (error: any) {
      console.error(error);
      isRequestPending.value = false;
      requestError.value = `${error.status}: ${error.data.message}`;
    }
  }
};

const submitHandler = computed(() =>
  !isEditing.value ? handleAddLinkFormSubmit : handleEditLinkFormSubmit
);

const handleRemoveLinkFormSubmit = async () => {
  isRequestPending.value = true;

  const groupId = props.group?._id;
  const linkId = linkIdOfInterest.value;
  const linkTo = linkValues.to;

  try {
    await $fetch(`/api/links/${linkId}`, {
      method: 'delete',
      query: {
        groupId
      }
    });
    emit('onRemoveLink', linkId, linkTo);
    notifications.add({
      id: 'sidebar-editor',
      title: 'Ссылка была удалена!'
    });
    onConfirmPopupClose();
  } catch (error: any) {
    console.error(error);
    isRequestPending.value = false;
    requestError.value = `${error.status}: ${error.data.message}`;
  }
};
</script>

<template>
  <main class="main">
    <div class="responsive-flex">
      <Sidebar
        :class="['aside-order', { 'aside-order_second': page === 'monographs' }]"
        :links="links"
        :is-icon-present="page === 'monographs'"
        :is-for-monographs="page === 'monographs'"
        :parent-route="page"
        @on-add-link-button-click="onAddLinkBtnClick"
        @on-edit-link-button-click="onEditLinkBtnClick"
        @on-remove-link-button-click="onRemoveLinkButtonClick"
      />
      <NuxtPage />
    </div>
    <LazyLinkForm
      v-if="isLoggedIn"
      :is-opened="isLinkFormPopupOpen"
      :link-value="linkValues"
      :is-editing="isEditing"
      :grouping-link-title="isEditing ? '' : group?.title"
      :is-request-pending="isRequestPending"
      :parent-route="`/${page}`"
      @on-close="onLinkFormPopupClose"
      @on-submit="submitHandler"
    />
    <LazyConfirmPopup
      v-if="isLoggedIn"
      :is-open="isConfirmPopupOpen"
      :is-request-pending="isRequestPending"
      :what-is-removed="'link'"
      :removed-item-title="linkValues.title"
      @on-close="onConfirmPopupClose"
      @on-agree="handleRemoveLinkFormSubmit"
    />
  </main>
</template>

<style lang="scss">
.aside-order {
  &_second {
    order: 1;

    @media screen and (max-width: 900px) {
      order: 0;
    }
  }
}
</style>
