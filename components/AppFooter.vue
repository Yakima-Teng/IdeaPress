<template>
  <div class="site-footer">
    <div class="name">
      {{ siteTitle }}
    </div>
    <div class="intro">
      {{ siteDesc }}
    </div>
    <div class="small">
      {{ siteCopyright }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const { siteTitle, siteDesc, siteCopyright } = useRuntimeConfig().public
</script>

<style lang="scss" scoped>
.site-footer {
  width: 100%;
  height: $siteFooterHeight;
  display: block;
  background-color: #1f2329;
  color: #ffffff;
  box-sizing: border-box;
  padding: 50px 96px;
  .name {
    display: block;
    font-size: 21px;
    font-weight: 600;
    color: #d2d3d4;
  }
  .intro {
    display: block;
    font-size: 12px;
    white-space: nowrap;
    color: #d2d3d4;
    margin: 15px 0;
  }
}
</style>
