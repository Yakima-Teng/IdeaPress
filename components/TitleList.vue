<template>
  <div class="title-list">
    <header class="section-header">
      <div class="header-left">
        {{ title }}
      </div>
      <div
        v-if="showMore"
        class="header-right"
        @click="emit('clickMore')"
      >
        更多&gt;&gt;
      </div>
    </header>
    <div class="section-articles">
      <div
        v-for="item in articles"
        :key="item.id"
        class="article-item"
        @click="toSeeArticle(item.id)"
      >
        <div class="title">
          {{ item.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

interface IArticle {
  id: number
  title: string
}
interface IProps {
  title: string
  showMore: boolean
  articles: IArticle[]
}
defineProps<IProps>()

const emit = defineEmits<{
  (e: 'clickMore'): void
}>()

const toSeeArticle = (id: number) => {
  router.push({
    path: `/articles/${id}`,
    query: {}
  })
}
</script>

<style lang="scss" scoped>
.title-list {
  display: block;
  border-radius: 6px;
  background-color: #ffffff;
  padding: 15px 10px;
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 42px;
    box-sizing: border-box;
    padding: 0 0 14px;
    margin: 0 10px;
    border-bottom: 1px solid #f4f5f7;
    .header-left {
      font-size: 18px;
      font-weight: bold;
    }
    .header-right {
      font-size: 12px;
      color: #99a5ad;
      font-weight: normal;
      user-select: none;
      cursor: pointer;
    }
  }
  .section-articles {
    display: block;
    padding: 10px;
    .article-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 36px;
    }
    .title {
      display: block;
      font-size: 14px;
      color: #333333;
      user-select: none;
      cursor: pointer;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:hover {
        color: #05c8a8;
      }
      &:before {
        content: '•';
        margin-right: 6px;
      }
    }
  }
}
</style>
