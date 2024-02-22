<script setup lang="ts">
const HEADER_LINK_GROUPS = [
  {
    id: 1,
    title: 'ОБ ИНСТИТУТЕ',
    group: 'about'
  },
  {
    id: 2,
    title: 'СТРУКТУРА',
    group: 'structure'
  },
  {
    id: 3,
    title: 'НОВОСТИ',
    group: 'news'
  },
  {
    id: 4,
    title: 'НАУЧНЫЕ ИЗДАНИЯ',
    group: 'publications'
  },
  {
    id: 5,
    title: 'ИССЛЕДОВАНИЯ И РАЗРАБОТКИ',
    group: 'research'
  },
  {
    id: 6,
    title: 'УСЛУГИ',
    group: 'service'
  },
  {
    id: 7,
    title: 'КОНТАКТЫ'
  },
  {
    id: 8,
    title: 'КАРТА САЙТА'
  }
];
</script>

<template>
  <header class="header">
    <div class="header__top-bg">
      <nav class="header__top">
        <span class="header__name">Институт природопользования НАН Беларуси</span>
        <NuxtLink to="/">
          <div class="header__icon header__icon_home"></div>
        </NuxtLink>
        <NuxtLink to="/site-map">
          <div class="header__icon header__icon_map"></div>
        </NuxtLink>
      </nav>
    </div>
    <div class="header__bottom-bg">
      <nav class="header__bottom">
        <ul class="header__bottom-links">
          <NuxtLink to="/" class="header__bottom-logo">
            <NuxtImg src="/logo.png" alt="Логотип" width="60" />
          </NuxtLink>
          <li v-for="{ id, title, group } of HEADER_LINK_GROUPS" :key="id">
            <DropdownMenu :title="title" />
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.header {
  color: white;

  .header__top-bg {
    background-color: $dark-blue;
  }
  .header__top {
    margin-left: 15%;
    padding: 5px;
    display: flex;
    gap: 14px;

    .header__name {
      font-weight: 500;
    }

    .header__icon {
      width: 24px;
      height: 24px;
      background-size: 100%;

      &.header__icon_home {
        background-image: url('~/assets/images/home-icon.svg');
      }

      &.header__icon_map {
        background-image: url('~/assets/images/map-icon.svg');
      }
    }
  }

  .header__bottom-bg {
    background-color: $mid-blue;

    .header__bottom {
      padding-inline: 5px;

      .header__bottom-logo {
        width: 72px;
      }

      .header__bottom-links {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
      }
    }
  }
}
</style>
