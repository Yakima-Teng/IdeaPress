<template>
  <div class="page-article">
    <div
      v-if="postData"
      class="page-main"
    >
      <div class="article-wrapper">
        <div class="post-header">
          <div class="title">
            {{ postData.title }}
            <NuxtLink
              v-if="loginUser"
              :to="`/admin/post?id=${postData.id}`"
            >
              编辑
            </NuxtLink>
          </div>
          <div class="byline">
            <div
              v-if="postData.postCat.name"
              class="author"
            >
              分类：{{ postData.postCat.name }}
            </div>
            <div
              v-if="postData.author"
              class="author"
            >
              作者：{{ postData.author }}
            </div>
            <div
              v-if="postData.source"
              class="author"
            >
              出处：{{ postData.source }}
            </div>
          </div>
          <div class="footer">
            <div class="footer-left">
              <div
                v-for="(tag, tagIdx) in postData.tag ? postData.tag.split(',') : []"
                :key="tagIdx"
                class="tag"
              >
                {{ tag }}
              </div>
            </div>
            <div class="footer-right">
              {{ postData.createdAt }}
            </div>
          </div>
        </div>

        <div
          class="post-content"
          v-html="postData.content"
        />
      </div>
      <SiteSidebar :cat-groups="sidebarGroups" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SiteSidebar from '~/components/SiteSidebar.vue'
import { ref } from 'vue'

const route = useRoute()

const loginUser = ref<TS.TLoginUser>()
const getLoginUser = async () => {
  const { data } = await useFetch<{ code: number; message: string; data: TS.TLoginUser }>(useRuntimeConfig().public.apiBase + '/loginUser', {
    method: 'GET',
  })
  if (data.value) {
    loginUser.value = data.value.data
  }
}
await getLoginUser()

const sidebarGroups = ref<Array<TS.IPostCat & { posts: TS.IPost[] }>>([])
const getSidebarGroups = async () => {
  const { data } = await useFetch<TS.IResponse<TS.IPostCatWithPosts[]>>(useRuntimeConfig().public.apiBase + '/sidebarCatsAndPosts', {
    method: 'GET',
    query: {},
  })
  const rawData = data.value
  if (rawData?.code !== 200) {
    sidebarGroups.value = []
  } else {
    sidebarGroups.value = rawData.data || []
  }
}
await getSidebarGroups()

const postData = ref<TS.IPost | null>(null)
const getPostData = async () => {
  const { data } = await useFetch<TS.IResponse<TS.IPost>>(useRuntimeConfig().public.apiBase + '/admin/post', {
    method: 'GET',
    query: {
      id: route.params.id,
    },
  })
  const rawData = data.value
  if (rawData?.code !== 200) {
    postData.value = null
  } else {
    postData.value = rawData.data
    console.log(postData.value)
  }
}
await getPostData()

if (postData.value) {
  useSeoMeta({
    title: postData.value.title,
    ogTitle: postData.value.title,
    description: postData.value.abstract,
    ogDescription: postData.value.abstract,
  })
}
</script>

<style lang="scss" scoped>
.page-article {
  display: block;
  background-color: #f3f5f7;
  .page-main {
    display: flex;
    width: 1200px;
    margin: 0 auto;
    padding: 30px 0;
    align-items: flex-start;
    justify-content: space-between;
  }
  .article-wrapper {
    display: block;
    width: 840px;
    flex-shrink: 0;
    background-color: #ffffff;
    .post-header {
      display: block;
      padding: 30px 20px;
      border-bottom: 1px solid #e6e6e6;
      .title {
        display: block;
        font-size: 18px;
        font-weight: bold;
        color: #323232;
        line-height: 24px;
      }
      .byline {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 18px;
        gap: 10px;
        .author {
          font-size: 12px;
          font-weight: 400;
          color: #999999;
        }
      }
      .footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;
        .footer-left {
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;
          gap: 10px;
          .tag {
            display: block;
            font-size: 12px;
            font-weight: 400;
            border: 1px solid #bababa;
            border-radius: 4px;
            height: 20px;
            line-height: 18px;
            padding: 0 6px;
            color: #bababa;
            user-select: none;
            cursor: pointer;
          }
        }
        .footer-right {
          display: block;
          font-size: 14px;
          color: #999999;
          font-weight: 400;
          line-height: 20px;
        }
      }
    }
    .post-content {
      display: block;
      font-size: 14px;
      color: #333333;
      font-weight: normal;
      line-height: 1.8;
      padding: 15px 20px;
      p {
        margin: 15px 0;
      }
    }
  }
}
</style>
