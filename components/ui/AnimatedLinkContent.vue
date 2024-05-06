<script setup lang="ts">
defineProps<{
  to: string;
  text: string;
  direction: 'left' | 'right';
}>();
</script>

<template>
  <NuxtLink
    :to="to"
    :class="['link', { link_left: direction === 'left', link_right: direction === 'right' }]"
  >
    <p v-if="direction === 'right'" class="link__text">{{ text }}</p>
    <p class="link__arrow">
      <svg
        v-if="direction === 'right'"
        height="24"
        width="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0h24v24H0z" fill="none"></path>
        <path
          d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
          fill="black"
        ></path>
      </svg>
      <svg
        v-if="direction === 'left'"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="black"
          d="m7.825 13l4.9 4.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-6.6-6.6q-.15-.15-.213-.325T4.426 12t.063-.375t.212-.325l6.6-6.6q.275-.275.688-.275t.712.275q.3.3.3.713t-.3.712L7.825 11H19q.425 0 .713.288T20 12t-.288.713T19 13z"
        />
      </svg>
    </p>
    <p v-if="direction === 'left'" class="link__text">{{ text }}</p>
  </NuxtLink>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables.scss' as *;

.link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 3px 7px 3px 10px;
  border-radius: 10px;
  overflow: hidden;
  background: transparent;
  color: $black;
  align-self: end;
  border: $mid-blue 1px solid;
  cursor: pointer;

  &_left {
    &:hover {
      .link__text {
        transform: translateX(-5px);
      }

      .link__arrow {
        transform: translateY(0px);
      }
    }

    .link__text {
      transform: translateX(-18px);
    }
  }

  &_right {
    &:hover {
      .link__text {
        transform: translateX(0px);
      }

      .link__arrow {
        transform: translateY(0px);
      }
    }

    .link__text {
      transform: translateX(20px);
    }
  }

  .link__text {
    font-size: 1rem;
    font-weight: 600;
    transition-duration: 0.3s;
  }

  .link__arrow {
    transform: translateY(35px);
    transition-duration: 0.3s;
  }
}
</style>
