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
import { computed } from "vue";
import { useRoute } from "nuxt/app";

const route = useRoute()

const font = reactive({
  color: 'rgba(0, 0, 0, .15)',
})
const { siteTitle, siteSubTitle, siteDesc } = useRuntimeConfig().public
const layout = computed(() => {
  const path = route.path
  if (['/login', '/register', '/start'].includes(path)) {
    return 'full-page'
  }
  return 'default'
})

useHead({
  title: siteSubTitle ? `${siteTitle} | ${siteSubTitle}` : siteTitle,
  meta: [
    { name: 'description', content: siteDesc }
  ],
  bodyAttrs: {
    class: 'body'
  },
  script: [ { innerHTML: 'console.log(\'Hello world\')' } ]
})
</script>
