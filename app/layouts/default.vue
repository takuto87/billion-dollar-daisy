<template>
  <div class="app-shell">
    <!-- サイドバー -->
    <aside class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
      <div class="sidebar__header">
        <div class="sidebar__logo">
          <span class="sidebar__logo-icon">✦</span>
          <span class="sidebar__logo-text">Daisy</span>
        </div>
        <button
          id="sidebar-toggle"
          class="sidebar__toggle"
          :aria-label="isSidebarCollapsed ? 'サイドバーを展開' : 'サイドバーを折りたたむ'"
          @click="isSidebarCollapsed = !isSidebarCollapsed"
        >
          <span class="sidebar__toggle-icon">{{ isSidebarCollapsed ? '›' : '‹' }}</span>
        </button>
      </div>

      <nav class="sidebar__nav" aria-label="メインナビゲーション">
        <ul class="sidebar__menu">
          <li v-for="item in navItems" :key="item.key" class="sidebar__menu-item">
            <NuxtLink
              :id="`nav-${item.key}`"
              :to="item.path"
              class="sidebar__menu-link"
              :aria-label="t(`nav.${item.key}`)"
            >
              <span class="sidebar__menu-icon" aria-hidden="true">{{ item.icon }}</span>
              <span class="sidebar__menu-text">{{ t(`nav.${item.key}`) }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="sidebar__footer">
        <div class="sidebar__user">
          <div class="sidebar__avatar" aria-hidden="true">A</div>
          <div class="sidebar__user-info">
            <p class="sidebar__user-name">管理者</p>
            <p class="sidebar__user-role">Administrator</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- メインコンテンツ -->
    <div class="main-wrapper">
      <header class="app-header">
        <div class="app-header__left">
          <button
            id="mobile-menu-toggle"
            class="app-header__mobile-toggle"
            aria-label="メニューを開く"
            @click="isSidebarCollapsed = !isSidebarCollapsed"
          >
            ☰
          </button>
          <div class="app-header__breadcrumb">
            <span class="app-header__page-title">{{ currentPageTitle }}</span>
          </div>
        </div>
        <div class="app-header__right">
          <div class="app-header__search">
            <input
              id="header-search"
              type="search"
              :placeholder="t('common.search')"
              class="app-header__search-input"
              aria-label="検索"
            >
            <span class="app-header__search-icon" aria-hidden="true">🔍</span>
          </div>
          <button id="notifications-btn" class="app-header__icon-btn" aria-label="通知">
            <span aria-hidden="true">🔔</span>
            <span class="app-header__badge">3</span>
          </button>
        </div>
      </header>

      <main class="main-content" id="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

const isSidebarCollapsed = ref(false)

const navItems = [
  { key: 'dashboard', path: '/', icon: '◈' },
  { key: 'analytics', path: '/analytics', icon: '◉' },
  { key: 'users', path: '/users', icon: '◎' },
  { key: 'settings', path: '/settings', icon: '⚙' },
]

const currentPageTitle = computed(() => {
  const current = navItems.find((item) => item.path === route.path)
  return current ? t(`nav.${current.key}`) : t('nav.dashboard')
})
</script>

<style lang="scss">
.app-shell {
  display: flex;
  min-height: 100vh;
  background: $color-bg-primary;
}

// ─── サイドバー ───────────────────────────────────────────────────
.sidebar {
  width: $sidebar-width;
  min-height: 100vh;
  background: $color-bg-secondary;
  border-right: 1px solid $color-border;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  transition: width $transition-base;
  overflow: hidden;

  &.collapsed {
    width: $sidebar-collapsed-width;

    .sidebar__logo-text,
    .sidebar__menu-text,
    .sidebar__user-info {
      opacity: 0;
      pointer-events: none;
    }

    .sidebar__toggle-icon {
      transform: rotate(0deg);
    }
  }

  &__header {
    @include flex-between;
    padding: $spacing-lg $spacing-md;
    border-bottom: 1px solid $color-border;
    height: $header-height;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    flex-shrink: 0;
  }

  &__logo-icon {
    font-size: $font-size-xl;
    @include gradient-text;
    flex-shrink: 0;
  }

  &__logo-text {
    font-size: $font-size-lg;
    font-weight: 700;
    @include gradient-text;
    transition: opacity $transition-base;
    white-space: nowrap;
  }

  &__toggle {
    width: 32px;
    height: 32px;
    @include flex-center;
    border-radius: $radius-sm;
    color: $color-text-secondary;
    transition: all $transition-fast;
    flex-shrink: 0;

    &:hover {
      background: $color-bg-hover;
      color: $color-text-primary;
    }
  }

  &__toggle-icon {
    font-size: $font-size-lg;
    line-height: 1;
    display: block;
    transition: transform $transition-base;
  }

  &__nav {
    flex: 1;
    padding: $spacing-md 0;
    overflow-y: auto;
    @include custom-scrollbar;
  }

  &__menu {
    list-style: none;
    padding: 0 $spacing-sm;
  }

  &__menu-item {
    margin-bottom: $spacing-xs;
  }

  &__menu-link {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-md;
    color: $color-text-secondary;
    transition: all $transition-fast;
    white-space: nowrap;
    min-height: 44px;

    &:hover {
      background: $color-bg-hover;
      color: $color-text-primary;
    }

    &.router-link-exact-active {
      background: rgba($color-accent-primary, 0.15);
      color: $color-accent-primary;
      border: 1px solid rgba($color-accent-primary, 0.3);
    }
  }

  &__menu-icon {
    font-size: $font-size-lg;
    width: 24px;
    text-align: center;
    flex-shrink: 0;
  }

  &__menu-text {
    font-size: $font-size-sm;
    font-weight: 500;
    transition: opacity $transition-base;
  }

  &__footer {
    padding: $spacing-md;
    border-top: 1px solid $color-border;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-sm;
    border-radius: $radius-md;
    transition: background $transition-fast;

    &:hover {
      background: $color-bg-hover;
    }
  }

  &__avatar {
    width: 36px;
    height: 36px;
    border-radius: $radius-full;
    background: $color-accent-gradient;
    @include flex-center;
    font-size: $font-size-sm;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
  }

  &__user-info {
    transition: opacity $transition-base;
  }

  &__user-name {
    font-size: $font-size-sm;
    font-weight: 600;
    color: $color-text-primary;
    white-space: nowrap;
  }

  &__user-role {
    font-size: $font-size-xs;
    color: $color-text-secondary;
    white-space: nowrap;
  }

  @include respond-below('lg') {
    transform: translateX(-100%);
    transition: transform $transition-base;

    &:not(.collapsed) {
      transform: translateX(0);
    }
  }
}

// ─── メインラッパー ────────────────────────────────────────────────
.main-wrapper {
  flex: 1;
  margin-left: $sidebar-width;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left $transition-base;

  @include respond-below('lg') {
    margin-left: 0;
  }
}

// ─── ヘッダー ─────────────────────────────────────────────────────
.app-header {
  height: $header-height;
  @include flex-between;
  padding: 0 $spacing-xl;
  background: rgba($color-bg-secondary, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid $color-border;
  position: sticky;
  top: 0;
  z-index: 50;

  &__left {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }

  &__mobile-toggle {
    display: none;
    width: 40px;
    height: 40px;
    @include flex-center;
    border-radius: $radius-sm;
    color: $color-text-secondary;
    font-size: $font-size-lg;
    transition: all $transition-fast;

    &:hover {
      background: $color-bg-hover;
      color: $color-text-primary;
    }

    @include respond-below('lg') {
      display: flex;
    }
  }

  &__page-title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $color-text-primary;
  }

  &__search {
    position: relative;
  }

  &__search-input {
    background: $color-bg-card;
    border: 1px solid $color-border;
    border-radius: $radius-full;
    padding: $spacing-sm $spacing-lg $spacing-sm calc($spacing-lg + 20px);
    color: $color-text-primary;
    font-size: $font-size-sm;
    font-family: inherit;
    width: 240px;
    transition: all $transition-fast;
    outline: none;

    &::placeholder {
      color: $color-text-muted;
    }

    &:focus {
      border-color: $color-accent-primary;
      box-shadow: 0 0 0 3px rgba($color-accent-primary, 0.1);
      width: 280px;
    }

    @include respond-below('md') {
      width: 160px;
    }
  }

  &__search-icon {
    position: absolute;
    left: $spacing-md;
    top: 50%;
    transform: translateY(-50%);
    font-size: $font-size-sm;
    pointer-events: none;
  }

  &__icon-btn {
    position: relative;
    width: 40px;
    height: 40px;
    @include flex-center;
    border-radius: $radius-sm;
    color: $color-text-secondary;
    font-size: $font-size-base;
    transition: all $transition-fast;

    &:hover {
      background: $color-bg-hover;
      color: $color-text-primary;
    }
  }

  &__badge {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 16px;
    height: 16px;
    background: $color-danger;
    border-radius: $radius-full;
    font-size: 10px;
    font-weight: 700;
    @include flex-center;
    color: white;
  }
}

// ─── メインコンテンツ ──────────────────────────────────────────────
.main-content {
  flex: 1;
  padding: $spacing-xl;
  @include fade-in;

  @include respond-below('md') {
    padding: $spacing-md;
  }
}
</style>
