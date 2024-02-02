<template>
  <div>
    <div class="site-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.site-content {
  display: block;
  width: 100%;
  min-height: 100vh;
}
</style>
