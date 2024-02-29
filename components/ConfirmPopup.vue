<script setup lang="ts">
const props = defineProps(['isOpen', 'whatIsRemoved', 'removedItemTitle', 'error']);
const emit = defineEmits(['onClose', 'onAgree']);
</script>

<template>
  <AppPopup :is-opened="isOpen" @on-close="emit('onClose')">
    <div class="confirm-popup">
      <h3>
        {{
          props.whatIsRemoved === 'link'
            ? `Вы уверены, что хотите удалить ссылку "${removedItemTitle}"?`
            : `Вы уверены, что хотите удалить страницу "${removedItemTitle}"`
        }}
      </h3>
      <span v-if="props.error" class="error">{{ props.error }}</span>
      <div class="confirm-popup__btns">
        <MenuButton :is-small="true" @click="emit('onClose')">Нет</MenuButton>
        <MenuButton :is-active="true" :is-small="true" @click="emit('onAgree')">Да</MenuButton>
      </div>
    </div>
  </AppPopup>
</template>

<style lang="scss">
.confirm-popup {
  display: flex;
  flex-direction: column;
  gap: 30px;

  h3 {
    text-align: center;
    max-width: 300px;
    font-size: 18px;
  }

  .confirm-popup__btns {
    display: flex;
    gap: 8px;
  }
}
</style>
