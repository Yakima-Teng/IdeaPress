<template>
  <div class="page-category-page-num">
    <div class="page-inner">
      <div class="page-main">
        <div class="articles-wrapper">
          <ArticleList
            :title="postCat?.name || '--'"
            :show-more="false"
            :articles="resultList"
          />
          <el-config-provider
            size="large"
            :z-index="3000"
            :locale="zhCn"
          >
            <el-pagination
              v-model:current-page="current"
              v-model:page-size="limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              :page-sizes="[10, 20, 50, 100]"
              :small="true"
              :background="true"
              @current-change="onCurrentChange"
              @size-change="onSizeChange"
            />
          </el-config-provider>
        </div>
        <SiteSidebar :cat-groups="sidebarGroups" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import ArticleList from '~/components/ArticleList.vue'

const route = useRoute()
const total = ref(0)
const current = ref(1)
const limit = ref(10)

const postCat = ref<TS.IPostCat | null>(null)
const getPostCat = async () => {
  const { data } = await useFetch<TS.IResponse<TS.IPostCat>>(useRuntimeConfig().public.apiBase + '/postCatByAlias', {
    method: 'GET',
    query: {
      alias: route.params.category,
    },
  })
  const rawData = data.value
  console.log(rawData)
  if (rawData?.code !== 200) {
    postCat.value = null
  } else {
    postCat.value = rawData.data
  }
}
await getPostCat()

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

const resultList = ref<TS.IPost[]>([])
const loading = ref(false)
const getPagePostList = async () => {
  loading.value = true
  try {
    resultList.value = []
    const { data } = await useFetch<TS.IResponse<{ count: number; rows: TS.IPost[] }>>(useRuntimeConfig().public.apiBase + '/postsByPostCat', {
      method: 'GET',
      params: {
        pageNum: current.value,
        pageSize: limit.value,
        keyword: '',
        // url路径上的参数
        catAlias: route.params.category,
      }
    })
    const rawData = data.value
    if (rawData?.code !== 200) {
      total.value = 0
      resultList.value = []
      return
    }
    total.value = rawData.data.count
    resultList.value = rawData.data.rows
  } finally {
    loading.value = false
  }
}
await getPagePostList()

const onCurrentChange = (pageNum: number) => {
  current.value = pageNum
  getPagePostList()
}

const onSizeChange = () => {
  current.value = 1
  getPagePostList()
}
</script>

<style lang="scss" scoped>
.page-category-page-num {
  display: block;
  background-color: #f3f5f7;
  .page-inner {
    display: block;
    width: 1200px;
    margin: 0 auto;
    padding: 30px 0;
  }
  .page-main {
    display: flex;
    width: 100%;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 20px;
  }
  .articles-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    width: 840px;
    flex-shrink: 0;
    gap: 15px;
    & > * {
      width: 100%;
    }
  }
}
</style>
