<script setup lang="ts">
const monographsState = useMgraphsState();
const monographsFromDb = await useMgraphs();
monographsState.value = monographsFromDb;

const linkGroupsState = useLinkGroupsState();
const monographsLinkGroup = linkGroupsState.value.find((group) => group.group === 'monographs');

useSeoMeta({
  title: 'Монографии'
});

definePageMeta({
  title: 'Монографии'
});

const linkValues = reactive({
  title: '',
  to: ''
});
const linkIdOfInterest = ref('');
let originalLinkValues = {
  title: '',
  to: ''
};
const isLinkFormPopupOpen = ref(false);
const isConfirmPopupOpen = ref(false);
const requestError = ref('');
const isEditing = ref(false);
const isRequestPending = ref(false);

const monographsLinks = computed(() => monographsLinkGroup?.links);

const router = useRouter();
if (monographsLinks.value && monographsLinks.value.length) {
  router.push({
    path: `/monographs${monographsLinks.value[0].to}`,
    replace: true
  });
}
const notifications = useToast();
const isLoggedIn = useLoggedInState();

const modifiedLinksArray = computed(() => {
  return monographsLinks.value?.map((link) => {
    const linkMgraphs = monographsState.value.filter((mono) => `/${mono.year}` === link.to);
    return { ...link, linkMgraphs: linkMgraphs.length };
  });
});

const onAddLinkButtonClick = () => {
  isEditing.value = false;
  isLinkFormPopupOpen.value = true;
};

const resetValues = () => {
  linkIdOfInterest.value = '';
  linkValues.title = '';
  linkValues.to = '';
  requestError.value = '';
  isRequestPending.value = false;
};

const onCloseLinkFormPopup = () => {
  isLinkFormPopupOpen.value = false;
  resetValues();
  isEditing.value = false;
  originalLinkValues = {
    title: '',
    to: ''
  };
};

const onEditLinkButtonClick = (linkId: string, linkTitle: string, linkTo: string) => {
  linkIdOfInterest.value = linkId;
  linkValues.title = linkTitle;
  linkValues.to = linkTo;
  originalLinkValues = {
    title: linkTitle,
    to: linkTo
  };
  isEditing.value = true;
  isLinkFormPopupOpen.value = true;
};

const onRemoveLinkButtonClick = (linkId: string, linkTitle: string, linkTo: string) => {
  linkIdOfInterest.value = linkId;
  linkValues.title = linkTitle;
  linkValues.to = linkTo;
  isConfirmPopupOpen.value = true;
};

const onConfirmPopupClose = () => {
  isConfirmPopupOpen.value = false;
  resetValues();
};

const handleAddLinkFormSubmit = async () => {
  isRequestPending.value = true;
  const groupId = monographsLinkGroup?._id;
  const newLinkBody = {
    title: linkValues.title,
    to: linkValues.to,
    groupId,
    type: 'param'
  };

  try {
    const newLink = await $fetch('/api/links', {
      method: 'post',
      body: newLinkBody
    });
    const linkGroupIndex = linkGroupsState.value.findIndex(
      (group) => group._id === monographsLinkGroup?._id
    );
    linkGroupsState.value[linkGroupIndex].links.push(newLink.newLinkTyped);
    router.push({
      path: `/monographs${
        monographsLinks.value ? monographsLinks.value[monographsLinks.value.length - 1].to : ''
      }`,
      replace: true
    });
    onCloseLinkFormPopup();
    notifications.add({ id: 'mgraphs', title: `Новая ссылка "${newLinkBody.title}" создана!` });
  } catch (error: any) {
    console.error(error);
    isRequestPending.value = false;
    requestError.value = `${error.status}: ${error.data.message}`;
  }
};

const handleEditLinkFormSubmit = async () => {
  isRequestPending.value = true;

  const commonLinkValues = {
    title: linkValues.title,
    to: linkValues.to
  };
  const editedLinkBody = {
    ...commonLinkValues,
    type: 'param'
  };

  if (JSON.stringify(originalLinkValues) === JSON.stringify(commonLinkValues)) {
    onCloseLinkFormPopup();
  } else {
    try {
      const editedLink = await $fetch(`/api/links/${linkIdOfInterest.value}`, {
        method: 'patch',
        body: editedLinkBody
      });

      if (editedLink) {
        const groupIndex = linkGroupsState.value.findIndex((group) => group.group === 'monographs');
        const linkIndex = linkGroupsState.value[groupIndex].links.findIndex(
          (link) => link._id === editedLink._id
        );
        linkGroupsState.value[groupIndex].links[linkIndex] = editedLink;
      }
      notifications.add({
        id: 'mgraphs',
        title: `Ссылка "${originalLinkValues.title}" была изменена!`
      });
      onCloseLinkFormPopup();
    } catch (error: any) {
      console.error(error);
      isRequestPending.value = false;
      requestError.value = `${error.status}: ${error.data.message}`;
    }
  }
};

const handleRemoveLinkFormSubmit = async () => {
  isRequestPending.value = true;

  const groupId = monographsLinkGroup?._id;
  const linkId = linkIdOfInterest.value;
  const linkTo = linkValues.to;
  try {
    const { message } = await $fetch(`/api/links/${linkId}`, {
      method: 'delete',
      query: {
        groupId
      }
    });
    if (message) {
      const groupIndex = linkGroupsState.value.findIndex((group) => group.group === 'monographs');
      linkGroupsState.value[groupIndex].links = linkGroupsState.value[groupIndex].links.filter(
        (link) => link._id !== linkId
      );
    }
    notifications.add({
      id: 'mgraphs',
      title: 'Ссылка была удалена!'
    });
    if (linkTo === `/${router.currentRoute.value.params.year}`) {
      router.push({
        path: `/monographs${
          monographsLinks.value && monographsLinks.value.length ? monographsLinks.value[0].to : ''
        }`,
        replace: true
      });
    }
    onConfirmPopupClose();
  } catch (error: any) {
    console.error(error);
    isRequestPending.value = false;
    requestError.value = `${error.status}: ${error.data.message}`;
  }
};

const addOrEditLinkHandlersForSubmit = computed(() =>
  isEditing.value ? handleEditLinkFormSubmit : handleAddLinkFormSubmit
);
</script>

<template>
  <main class="main">
    <div class="responsive-flex">
      <NuxtPage keepalive />
      <Sidebar
        :links="modifiedLinksArray"
        :is-icon-present="true"
        :is-for-monographs="true"
        :parent-route="'monographs'"
        @on-add-link-button-click="onAddLinkButtonClick"
        @on-edit-link-button-click="onEditLinkButtonClick"
        @on-remove-link-button-click="onRemoveLinkButtonClick"
      />
    </div>
    <LazyLinkForm
      v-if="isLoggedIn"
      :link-value="linkValues"
      :is-opened="isLinkFormPopupOpen"
      :grouping-link-title="isEditing ? '' : 'Монографии'"
      :is-for-monographs="true"
      :is-editing="isEditing"
      :is-request-pending="isRequestPending"
      :error="requestError"
      @on-close="onCloseLinkFormPopup"
      @on-submit="addOrEditLinkHandlersForSubmit"
    />
    <LazyConfirmPopup
      :is-open="isConfirmPopupOpen"
      :what-is-removed="'link'"
      :removed-item-title="linkValues.title"
      :is-request-pending="isRequestPending"
      @on-agree="handleRemoveLinkFormSubmit"
      @on-close="onConfirmPopupClose"
    />
  </main>
</template>

<style lang="scss"></style>
