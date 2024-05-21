<script setup lang="ts">
import type RemovedItem from '~/types/RemovedItemForConfirmPopup';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  whatIsRemoved: {
    type: String as () => RemovedItem,
    required: true
  },
  removedItemTitle: {
    type: String,
    required: false
  },
  error: String
});
const emit = defineEmits(['onClose', 'onAgree']);

const COMMON_CONFIRM_MESSAGE = 'Вы уверены, что хотите удалить';

const message = {
  linkGroup: () => `${COMMON_CONFIRM_MESSAGE} группу ссылок "${props.removedItemTitle}"?`,
  link: () => `${COMMON_CONFIRM_MESSAGE} ссылку "${props.removedItemTitle}"?`,
  route: () => `${COMMON_CONFIRM_MESSAGE} страницу "${props.removedItemTitle}"?`,
  section: () => `${COMMON_CONFIRM_MESSAGE} раздел "${props.removedItemTitle}"?`,
  newsItem: () => `${COMMON_CONFIRM_MESSAGE} новость "${props.removedItemTitle}"?`,
  confItem: () => `${COMMON_CONFIRM_MESSAGE} данную конференцию?`,
  file: () => `${COMMON_CONFIRM_MESSAGE} файл "${props.removedItemTitle}"?`,
  persona: () => `${COMMON_CONFIRM_MESSAGE} данный контакт?`
};
</script>

<template>
  <ClientOnly>
    <AppPopup :is-opened="isOpen" @on-close="emit('onClose')">
      <div class="confirm-popup">
        <h3>
          {{ whatIsRemoved ? message[whatIsRemoved]() : '' }}
        </h3>
        <p v-if="props.whatIsRemoved === 'route'">
          Обратите внимание: будут удалены все ссылки, ведущие на эту страницу
        </p>
        <span v-if="props.error" class="error">{{ props.error }}</span>
        <div class="confirm-popup__btns">
          <MenuButton :size="'small'" @click="emit('onClose')">Нет</MenuButton>
          <MenuButton :is-active="true" :size="'small'" @click="emit('onAgree')">Да</MenuButton>
        </div>
      </div>
    </AppPopup>
  </ClientOnly>
</template>

<style lang="scss">
.confirm-popup {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 300px;
  text-align: center;

  h3 {
    font-size: 18px;
  }

  .confirm-popup__btns {
    display: flex;
    gap: 8px;
  }
}
</style>
