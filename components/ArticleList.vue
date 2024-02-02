<template>
  <div class="article-list">
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
        <div
          class="article-left"
          :style="{ backgroundImage: `url('${item.cover}')` }"
        />
        <div class="article-right">
          <div class="right-header">
            {{ item.title }}
          </div>
          <div class="right-abstract">
            {{ item.abstract }}
          </div>
          <div class="right-byline">
            <div class="author">
              作者/出处：{{ item.author || item.source }}
            </div>
          </div>
          <div class="right-footer">
            <div class="footer-left">
              <div
                v-for="tag in item.tag ? item.tag.split(',') : []"
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </div>
            </div>
            <div class="footer-right">
              {{ item.updateTime }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

interface IProps {
  title: string
  showMore: boolean
  articles: TS.IPost[]
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
.article-list {
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
    .article-item {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      user-select: none;
      cursor: pointer;
      &:nth-of-type(n + 2) {
        margin-top: 16px;
      }
      &:hover {
        box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.1);
        .right-header {
          color: #05c8a8;
        }
      }
    }
    .article-left {
      display: block;
      width: 200px;
      height: 130px;
      flex-shrink: 0;
      border: 1px solid #f5f5f5;
      border-radius: 4px;
      background: transparent scroll no-repeat center center;
      background-size: cover;
    }
    .article-right {
      display: block;
      width: calc(100% - 215px);
      margin-left: 15px;
    }
    .right-header {
      display: block;
      font-size: 16px;
      font-weight: bold;
      color: #333333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 24px;
    }
    .right-abstract {
      display: -webkit-box;
      margin-top: 6px;
      height: 36px;
      line-height: 18px;
      font-size: 14px;
      color: #7a7a7a;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .right-byline {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-top: 12px;
      .author {
        font-size: 12px;
        color: #7d8d97;
      }
    }
    .right-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 12px;
      .footer-left {
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        gap: 12px;
        .tag {
          display: block;
          font-size: 12px;
          font-weight: 400;
          line-height: 20px;
          border: 1px solid #bababa;
          border-radius: 4px;
          padding: 0 6px;
          color: #bababa;
        }
      }
      .footer-right {
        display: block;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #bababa;
      }
    }
  }
}
</style>
