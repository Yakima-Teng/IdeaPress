<template>
  <div class="sidebar-wrapper">
    <TitleList
      v-for="cat in catGroups"
      :key="cat.id"
      :title="cat.name"
      show-more
      :articles="cat.posts"
      @click-more="() => router.push({ path: `/${cat.alias}/1` })"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'nuxt/app'
import TitleList from '~/components/TitleList.vue'

interface IProps {
  catGroups: Array<TS.IPostCat & { posts: TS.IPost[] }>
}
defineProps<IProps>()

const router = useRouter()
</script>

<style lang="scss" scoped>
.sidebar-wrapper {
  display: block;
  width: 340px;
  flex-shrink: 0;
  .title-list {
    &:nth-of-type(n + 2) {
      margin-top: 20px;
    }
  }
}
</style>
