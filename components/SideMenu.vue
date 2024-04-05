<script setup lang="ts">
const groupData = reactive({
  title: ''
});
const linkValues = reactive({
  title: '',
  to: ''
});
const groupDataForAddingNewLink = ref({
  id: '',
  title: ''
});
const isAddGroupPopupOpen = ref(false);
const isAddLinkPopupOpen = ref(false);
const linkGroupError = ref('');
const linkError = ref('');
const allGroupLinks = useLinkGroupsState();
const route = useRoute();
const router = useRouter();

const labsCentersLinkGroups = computed(() => {
  return allGroupLinks.value.filter((group) => group.group === 'labs-and-centers');
});

const handleAddGroupBtnClick = () => {
  isAddGroupPopupOpen.value = true;
};

const handleAddLinkBtnClick = (groupTitle: string, groupId: string) => {
  groupDataForAddingNewLink.value.title = groupTitle;
  groupDataForAddingNewLink.value.id = groupId;
  isAddLinkPopupOpen.value = true;
};

const handleAddLinkFormClose = () => {
  isAddLinkPopupOpen.value = false;
  linkValues.title = '';
  linkValues.to = '';
  groupDataForAddingNewLink.value = {
    id: '',
    title: ''
  };
};

const onPopupClose = () => {
  groupData.title = '';
  isAddGroupPopupOpen.value = false;
};

const handleLinkGroupFormSubmit = async () => {
  try {
    const data = await $fetch('/api/link-groups', {
      method: 'post',
      body: {
        title: groupData.title,
        group: 'labs-and-centers'
      }
    });
    allGroupLinks.value = [...allGroupLinks.value, data];
    onPopupClose();
  } catch (error: any) {
    linkGroupError.value = error.message;
    console.error(error);
  }
};

const handleLinkFormSubmit = async () => {
  const body = {
    title: linkValues.title,
    to: linkValues.to
  };

  try {
    const newLinkBody = {
      ...body,
      groupId: groupDataForAddingNewLink.value.id
    };
    const { updatedGroup, newLinkTyped } = await $fetch('/api/links', {
      method: 'post',
      body: newLinkBody
    });
    const groupIndex = labsCentersLinkGroups.value.findIndex(
      (group) => group._id === updatedGroup._id
    );
    labsCentersLinkGroups.value[groupIndex].links.push(newLinkTyped);
    handleAddLinkFormClose();
  } catch (error: any) {
    linkError.value = error.message;
    console.error(error);
  }
};
</script>

<template>
  <div>
    <ul>
      <li v-for="{ _id: groupId, title, links } of labsCentersLinkGroups">
        {{ title }}
        <ul>
          <li v-for="{ title, to } of links">
            <NuxtLink :to="`/labs-and-centers${to}`">
              {{ title }}
            </NuxtLink>
          </li>
        </ul>
        <AddLinkButton :color="'blue'" @on-click="handleAddLinkBtnClick(title, groupId)" />
      </li>
    </ul>
    <AddLinkButton :color="'white'" @on-click="handleAddGroupBtnClick" />
    <LazyLinkGroupForm
      v-model="groupData"
      :is-open="isAddGroupPopupOpen"
      @on-close="onPopupClose"
      @on-submit="handleLinkGroupFormSubmit"
    />
    <LazyLinkForm
      :link-value="linkValues"
      :is-opened="isAddLinkPopupOpen"
      :grouping-link-title="groupDataForAddingNewLink.title"
      :error="linkError"
      @on-submit="handleLinkFormSubmit"
      @on-close="handleAddLinkFormClose"
    />
  </div>
</template>

<style lang="scss"></style>
