<template>
  <div>
    <AppHeader />
    <div class="site-content">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.site-content {
  display: block;
  width: 100%;
  padding-top: $siteHeaderHeight;
  min-height: calc(100vh - $siteFooterHeight);
}
</style>
