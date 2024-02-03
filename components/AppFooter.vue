<template>
  <div class="site-footer">
    <div class="name">
      {{ siteSetting.siteTitle }}
    </div>
    <div class="intro">
      {{ siteSetting.siteDesc }}
    </div>
    <div class="small">
      {{ siteSetting.siteCopyright }}
      <a
        v-if="siteSetting.siteBeian"
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="nofollow noreferrer noopener"
        style="text-decoration:none;color:inherit;margin-left:8px;"
      >
        {{ siteSetting.siteBeian }}
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
const siteSettingStore = useSiteSettingStore()
const { siteSetting } = storeToRefs(siteSettingStore)
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
  .small {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 12px;
    white-space: nowrap;
    color: #d2d3d4;
    margin: 15px 0;
    text-decoration: none;
  }
}
</style>
