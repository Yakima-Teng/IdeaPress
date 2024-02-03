<template>
  <div>
    <el-watermark
      :font="font"
      :content="[siteTitle]"
    >
      <NuxtLayout :name="layout">
        <NuxtPage />
      </NuxtLayout>
    </el-watermark>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const font = reactive({
  color: 'rgba(0, 0, 0, .15)',
})
const siteSettingStore = useSiteSettingStore()
const { siteSetting } = storeToRefs(siteSettingStore)
callOnce(siteSettingStore.fetchSiteSetting)

const layout = computed(() => {
  const path = route.path
  if (['/login', '/register', '/start'].includes(path)) {
    return 'full-page'
  }
  return 'default'
})



useHead({
  title: siteSetting.value?.siteSubTitle ? `${siteSetting.value?.siteTitle} | ${siteSetting.value?.siteSubTitle}` : siteSetting.value?.siteTitle,
  meta: [
    siteSetting.value?.siteKeywords && { name: 'keywords', content: siteSetting.value?.siteKeywords },
    siteSetting.value?.siteDesc && { name: 'description', content: siteSetting.value?.siteDesc }
  ].filter(Boolean) as Array<{ name: string; content: string }>,
  bodyAttrs: {
    class: 'body'
  },
  script: [ { innerHTML: 'console.log(\'欢迎使用IdeaPress，详情见：https://www.verysystems.com/\')' } ]
})
</script>
