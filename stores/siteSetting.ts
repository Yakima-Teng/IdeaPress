export const useSiteSettingStore = defineStore('siteSetting', () => {
  const siteSetting = ref<TS.ISiteSetting>()
  async function fetchSiteSetting() {
    const { data: resp } = await useFetch<TS.IResponse<TS.ISiteSetting>>('/api/admin/siteSetting/query', {
      method: 'GET',
    })
    if (!resp.value) {
      return
    }
    const { code, message, data } = resp.value
    if (code !== 200) {
      ElMessage.warning(message)
      return
    }
    siteSetting.value = data
  }

  return {
    siteSetting,
    fetchSiteSetting,
  }
})
