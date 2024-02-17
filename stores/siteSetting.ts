export const useSiteSettingStore = defineStore('siteSetting', () => {
  const siteSetting = ref<TS.ISiteSetting>({
    homeTitle: '',
    homeKeywords: '',
    homeDesc: '',
    siteTitle: '',
    siteSubTitle: '',
    siteDesc: '',
    siteKeywords: '',
    siteBeian: '',
    siteCopyright: '',
    siteLogo: '',
    siteTitleSeparator: '',
    homeBigBannerTitle: '',
    homeBigBannerDesc: '',
    homeBigBannerBtn1Label: '',
    homeBigBannerBtn1Link: '',
    homeBigBannerBtn2Label: '',
    homeBigBannerBtn2Link: '',
    homeTopAdImageLink: '',
    homeTopAdJumpLink: '',
    menus: [],
    carousels: [],
  })
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
