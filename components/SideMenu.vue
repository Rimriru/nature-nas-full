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
  <div class="side-menu">
    <ul class="side-menu__link-groups">
      <li
        v-for="{ _id: groupId, title, links } of labsCentersLinkGroups"
        class="side-menu__link-group"
      >
        <div class="side-menu__group-container">
          <EditBtn :color="'gray'" :appliedClass="'side-menu__edit-btn'" />
          <p class="side-menu__group-title">{{ title }}</p>
        </div>
        <ul class="side-menu__links centered-links">
          <li v-for="{ title, to } of links" class="side-menu__link">
            <NuxtLink :to="`/labs-and-centers${to}`" exact-active-class="side-menu__link">
              {{ title }}
            </NuxtLink>
          </li>
        </ul>
        <AddLinkButton
          :color="'blue'"
          :applied-styles="'centered-links'"
          @on-click="handleAddLinkBtnClick(title, groupId)"
        />
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

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.centered-links {
  margin-left: 50px;
}

.side-menu {
  max-width: 300px;
  text-align: center;
  padding-top: 20px;
  margin-left: 25px;

  .side-menu__link-groups {
    display: flex;
    flex-direction: column;
    row-gap: 15px;

    .side-menu__group-container {
      display: flex;
      align-items: center;
      border: $mid-blue 1px solid;
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      margin-bottom: 5px;

      .side-menu__edit-btn {
        margin: 5px 12px;
      }

      .side-menu__group-title {
        border-left: $mid-blue 1px solid;
        padding-block: 10px;
        width: 100%;
        transition: all 0.1s ease-in;
        cursor: pointer;

        &:hover {
          background-color: $gray;
          color: #fff;
        }
      }
    }

    .side-menu__links {
      border: $mid-blue 1px solid;
      max-width: 250px;

      .side-menu__link {
        padding-block: 5px;

        &:hover {
          background-color: $gray;
          color: #fff;
        }

        &_active {
          background-color: $mid-blue;
        }
      }
    }
  }
}
</style>
