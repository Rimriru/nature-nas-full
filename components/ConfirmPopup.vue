<script setup lang="ts">
type RemovedItem = 'link' | 'route' | 'section';
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
    required: true
  },
  error: String
});
const emit = defineEmits(['onClose', 'onAgree']);

const message = {
  link: () => `Вы уверены, что хотите удалить ссылку "${props.removedItemTitle}"?`,
  route: () => `Вы уверены, что хотите удалить страницу "${props.removedItemTitle}"?`,
  section: () => `Вы уверены, что хотите удалить раздел "${props.removedItemTitle}"?`
};
</script>

<template>
  <AppPopup :is-opened="isOpen" @on-close="emit('onClose')">
    <div class="confirm-popup">
      <h3>
        {{ message[whatIsRemoved]() }}
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
