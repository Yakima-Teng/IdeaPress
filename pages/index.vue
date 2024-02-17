<template>
  <div class="page-index">
    <HeroBanner
      v-if="siteSetting.homeBigBannerTitle"
      :main-title="siteSetting.homeBigBannerTitle"
      :sub-title="siteSetting.homeBigBannerDesc"
      :button-list="list"
    />

    <div class="page-inner">
      <div class="header-wrapper">
        <div class="header-bar">
          <div class="header-bar-left">
            <div
              v-for="item in tabList"
              :key="item.value"
              :class="['tab', { active: item.value === activeTabValue }]"
              @click="toggleTabValue(item.value)"
            >
              {{ item.label }}
            </div>
          </div>
          <div
            class="header-bar-right"
          >
            <a
              class="highlight"
              href="https://www.bing.com"
              target="_blank"
            >
              广告位
            </a>
          </div>
        </div>
        <div class="search-wrapper">
          <el-input
            v-model="keyword"
            placeholder="请输入关键词"
            class="input-with-select"
            size="large"
            @keyup.enter="onSearch"
          >
            <template
              v-if="activeTabValue === 'pubmed'"
              #prepend
            >
              <el-select
                v-model="range"
                placeholder="请选择搜索范围"
                style="width: 115px"
                size="large"
              >
                <el-option
                  label="标题"
                  value="1"
                />
              </el-select>
            </template>
            <template #append>
              <el-button
                class="btn-search"
                :icon="Search"
                size="large"
                @click="onSearch"
              >
                立即查询
              </el-button>
            </template>
          </el-input>
        </div>
      </div>

      <a
        v-if="siteSetting.homeTopAdImageLink && siteSetting.homeTopAdJumpLink"
        :href="siteSetting.homeTopAdJumpLink"
        class="top-ad"
        target="_blank"
        rel="noopenner noreferrer"
      >
        <img
          :src="siteSetting.homeTopAdImageLink"
          alt=""
          class="top-ad-image"
        >
      </a>

      <CarouselList
        v-if="siteSetting.carousels.length > 0"
        :carousels="siteSetting.carousels"
      />

      <div class="page-main">
        <div class="articles-wrapper">
          <ArticleList
            v-for="cat in mainGroups"
            :key="cat.id"
            :title="cat.name"
            show-more
            :articles="cat.posts"
            @click-more="() => router.push({ path: `/${cat.alias}/1` })"
          />
        </div>
        <SiteSidebar :cat-groups="sidebarGroups" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import ArticleList from '~/components/ArticleList.vue'

const siteSettingStore = useSiteSettingStore()
const { siteSetting } = storeToRefs(siteSettingStore)

useHead({
  title: siteSetting.value?.siteSubTitle ? `${siteSetting.value?.siteTitle} ${siteSetting.value?.siteTitleSeparator || '-'} ${siteSetting.value?.siteSubTitle}` : siteSetting.value?.siteTitle,
  titleTemplate: (title?: string) => {
    if (siteSetting.value?.homeTitle) {
      return siteSetting.value?.homeTitle
    }
    return title || ''
  },
  meta: [
    siteSetting.value?.homeKeywords && { name: 'keywords', content: siteSetting.value?.homeKeywords },
    siteSetting.value?.siteKeywords && !siteSetting.value?.homeKeywords && { name: 'keywords', content: siteSetting.value?.siteKeywords },
    siteSetting.value?.homeDesc && { name: 'description', content: siteSetting.value?.homeDesc },
    siteSetting.value?.siteDesc && !siteSetting.value?.homeDesc && { name: 'description', content: siteSetting.value?.siteDesc }
  ].filter(Boolean) as Array<{ name: string; content: string }>,
})

const list = computed(() => {
  const setting = siteSetting.value
  const btn1Link = setting.homeBigBannerBtn1Link
  const btn1Label = setting.homeBigBannerBtn1Label
  const btn2Link = setting.homeBigBannerBtn2Link
  const btn2Label = setting.homeBigBannerBtn2Label
  const returnArr: Array<{ label: string; link: string }> = []
  if (btn1Link && btn1Label) {
    returnArr.push({ label: btn1Label, link: btn1Link })
  }
  if (btn2Link && btn2Label) {
    returnArr.push({ label: btn2Label, link: btn2Link })
  }
  return returnArr
})

const router = useRouter()
const tabList = [
  { label: '文章', value: 'posts' },
  { label: '产品', value: 'products' },
]
const activeTabValue = ref(tabList[0]?.value || '')
const keyword = ref('')
const range = ref('1')

const toggleTabValue = (tabValue: string) => {
  activeTabValue.value = tabValue
}

const mainGroups = ref<Array<TS.IPostCat & { posts: TS.IPost[] }>>([])
const getMainGroups = async () => {
  const { data } = await useFetch<TS.IResponse<TS.IPostCatWithPosts[]>>(useRuntimeConfig().public.apiBase + '/mainCatsAndPosts', {
    method: 'GET',
    query: {},
  })
  const rawData = data.value
  if (rawData?.code !== 200) {
    mainGroups.value = []
  } else {
    mainGroups.value = rawData.data || []
  }
}

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

await Promise.all([
  getMainGroups(),
  getSidebarGroups(),
])

const onSearch = () => {
  if (!keyword.value) {
    ElMessage({
      message: '请输入关键词',
      type: 'warning',
    })
    return
  }
  const tabValue = activeTabValue.value
  if (tabValue === 'pubmed') {
    router.push({
      path: '/',
      query: {
        range: range.value,
        kw: keyword.value,
        cat: '1',
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.page-index {
  display: block;
  background-color: #f3f5f7;
  .hero-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    .img-version {
      margin-left: 0.5em;
    }
  }
  .page-inner {
    display: block;
    width: 1200px;
    margin: 0 auto;
    padding: 30px 0;
  }
  .header-wrapper {
    display: block;
    padding: 30px 20px;
    background-color: #ffffff;
    border-radius: 8px;
    .header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .header-bar-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .tab {
        display: block;
        width: 116px;
        height: 40px;
        line-height: 38px;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        background-color: #f6f6f6;
        border-radius: 6px 6px 0 0;
        cursor: pointer;
        text-align: center;
        &.active {
          color: #ffffff;
          background-color: #06bcba;
          font-weight: bold;
          box-shadow: 0 5px 5px 1px rgba(0, 0, 0, 0.2);
        }
      }
    }
    .header-bar-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      .highlight {
        font-size: 14px;
        color: #ff961e;
        font-weight: 400;
        text-decoration: none;
      }
    }
    .search-wrapper {
      display: block;
      border: 1px solid #06bcba;
      .btn-search {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #07aea0;
        color: #ffffff;
      }
    }
  }
  .top-ad {
    display: block;
    margin: 20px auto;
    width: 100%;
    height: auto;
    .top-ad-image {
      display: block;
      width: 100%;
      height: auto;
    }
  }
  .page-main {
    display: flex;
    width: 100%;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 20px;
  }
  .articles-wrapper {
    display: block;
    width: 840px;
    flex-shrink: 0;
  }
}
</style>
