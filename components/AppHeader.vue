<template>
  <div class="site-header">
    <div class="header-left">
      <RouterLink
        class="site-title"
        to="/"
      >
        <img
          src="/favicon.ico"
          alt=""
          class="icon"
        >
        {{ siteTitle }}
      </RouterLink>
    </div>
    <div class="header-right">
      <template v-if="loginUser">
        <NuxtLink
          class="right-link"
          to="/admin/posts"
        >
          文章管理
        </NuxtLink>
        <NuxtLink
          class="right-link"
          to="/admin/post-cats"
        >
          分类管理
        </NuxtLink>
        <NuxtLink
          class="right-link"
          to="/admin/setting"
        >
          网站设置
        </NuxtLink>
        <el-divider
          direction="vertical"
          border-style="dashed"
        />
        <a
          v-if="loginUser"
          class="right-link"
          @click="toLogout"
        >退出登录</a>
        <el-avatar
          :size="32"
          src="/avatar.png"
        />
      </template>

      <template v-if="!loginUser">
        <NuxtLink
          class="right-link"
          to="/login"
        >
          登录
        </NuxtLink>
        <el-divider
          direction="vertical"
          border-style="dashed"
        />
        <NuxtLink
          class="right-link"
          to="/register"
        >
          注册
        </NuxtLink>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const loginUser = ref<TS.TLoginUser>()
const token = useCookie('token')

const { siteTitle, apiBase } = useRuntimeConfig().public

// 退出登录后跳转到首页
const toLogout = () => {
  token.value = null
  location.reload()
}

const { data } = await useFetch<{ code: number; message: string; data: TS.TLoginUser }>(apiBase + '/loginUser', {
  method: 'GET',
})
if (data.value) {
  loginUser.value = data.value.data
}
</script>

<style lang="scss" scoped>
.site-header {
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;
  width: 100%;
  height: $siteHeaderHeight;
  padding: 0 96px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  background-color: #051c3b;
  color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}
.header-left {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  .site-title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 28px;
    line-height: 60px;
    color: #ffffff;
    letter-spacing: 1px;
    font-weight: bold;
    text-decoration: none;
    gap: 10px;
  }
}
.header-right {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
  .right-link {
    display: block;
    font-size: 14px;
    color: #ffffff;
    font-weight: 600;
    line-height: 60px;
    transition: 300ms color;
    background-color: transparent;
    text-decoration: none;
    user-select: none;
    cursor: pointer;
    &:hover {
      color: #3370ff;
    }
  }
}

@media screen and (max-width: 800px) {
  .site-header {
    flex-direction: column;
    padding: 0;
    height: 60px;
  }
  .header-right {
    display: none;
  }
}
</style>
