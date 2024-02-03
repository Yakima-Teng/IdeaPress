export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token')
  // 没有token的话，不允许访问管理后台页面（以/admin开头）
  if (to.path.startsWith('/admin') && !token.value) {
    return navigateTo('/login', { redirectCode: 302 })
  }
})
