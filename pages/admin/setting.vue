<template>
  <div class="page-setting">
    <el-tabs
      v-model="activeTabName"
      tab-position="left"
      style="height: auto;"
    >
      <el-tab-pane
        label="全局设置"
        name="global"
      >
        <el-alert
          title="全局设置"
          type="info"
          effect="dark"
          :closable="false"
          style="margin-bottom:20px;"
        />

        <div class="page-header">
          <div class="header-left">
            <div class="line">
              <el-input
                v-model="editingSetting.siteTitle"
                placeholder="请输入网站标题"
                @change="onChangeField('siteTitle', $event)"
              >
                <template #prepend>
                  网站标题（必填）
                </template>
              </el-input>
            </div>

            <div class="line">
              <el-input
                v-model="editingSetting.siteSubTitle"
                placeholder="请输入网站副标题（可选）"
                @change="onChangeField('siteSubTitle', $event)"
              >
                <template #prepend>
                  网站副标题（可选）
                </template>
              </el-input>
            </div>
            <div class="line">
              <el-input
                v-model="editingSetting.siteBeian"
                placeholder="请输入备案信息（可选）"
                @change="onChangeField('siteBeian', $event)"
              >
                <template #prepend>
                  备案信息（可选）
                </template>
              </el-input>
            </div>
            <div class="line">
              <el-input
                v-model="editingSetting.siteCopyright"
                placeholder="请输入版权信息（可选）"
                @change="onChangeField('siteCopyright', $event)"
              >
                <template #prepend>
                  版权信息（可选）
                </template>
              </el-input>
            </div>
          </div>
          <div class="avatar-wrapper">
            <span
              v-if="!editingSetting.siteLogo"
              class="note"
            >点击上传网站图标</span>
            <div
              v-if="editingSetting.siteLogo"
              class="image-preview"
              :style="{ backgroundImage: `url('${editingSetting.siteLogo}')` }"
            />
            <input
              ref="siteLogoRef"
              type="file"
              class="field-file"
              accept="image/*"
              @change="onChangeSiteLogo"
            >
          </div>
        </div>

        <div class="abstract-wrapper">
          <el-divider content-position="left">
            <el-tag>网站描述（可选）</el-tag>
          </el-divider>
          <el-input
            v-model="editingSetting.siteDesc"
            :rows="2"
            type="textarea"
            placeholder="请输入网站描述（选填）"
            @change="onChangeField('siteDesc', $event)"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="SEO设置"
        name="seo"
      >
        <el-alert
          title="整站SEO设置"
          type="info"
          effect="dark"
          :closable="false"
          style="margin-bottom:20px;"
        />
        <div class="page-header">
          <div class="header-left">
            <div class="line">
              <el-input
                v-model="editingSetting.siteTitleSeparator"
                placeholder="请输入网站标题间隔符"
                @change="onChangeField('siteTitleSeparator', $event)"
              >
                <template #prepend>
                  网站标题（必填）
                </template>
              </el-input>
            </div>
            <div class="line">
              <el-input
                v-model="editingSetting.siteKeywords"
                placeholder="请输入网站关键词（可选，多个关键词以英文逗号分隔）"
                @change="onChangeField('siteKeywords', $event)"
              >
                <template #prepend>
                  网站关键词（可选，多个关键词以英文逗号分隔）
                </template>
              </el-input>
            </div>
          </div>
        </div>
        <el-alert
          title="首页SEO设置"
          type="info"
          effect="dark"
          :closable="false"
          style="margin:20px 0;"
        />
        <div class="page-header">
          <div class="header-left">
            <div class="line">
              <el-input
                v-model="editingSetting.homeTitle"
                placeholder="请输入首页标题"
                @change="onChangeField('homeTitle', $event)"
              >
                <template #prepend>
                  首页标题（选填）
                </template>
              </el-input>
            </div>
            <div class="line">
              <el-input
                v-model="editingSetting.homeKeywords"
                placeholder="请输入首页关键词（可选，多个关键词以英文逗号分隔）"
                @change="onChangeField('homeKeywords', $event)"
              >
                <template #prepend>
                  首页关键词（可选，多个关键词以英文逗号分隔）
                </template>
              </el-input>
            </div>
            <el-divider content-position="left">
              <el-tag>首页描述（可选）</el-tag>
            </el-divider>
            <div class="line">
              <el-input
                v-model="editingSetting.homeDesc"
                :rows="2"
                type="textarea"
                placeholder="请输入首页描述（选填）"
                @change="onChangeField('homeDesc', $event)"
              />
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="首页设置"
        name="homepage"
      >
        <el-alert
          title="首页顶部大Banner设置"
          type="info"
          effect="dark"
          :closable="false"
          style="margin-bottom:20px;"
        />
        <div class="page-header">
          <div class="header-left">
            <div class="line">
              <el-input
                v-model="editingSetting.homeBigBannerTitle"
                placeholder="请输入标题"
                @change="onChangeField('homeBigBannerTitle', $event)"
              >
                <template #prepend>
                  标题
                </template>
              </el-input>
            </div>
            <div class="line">
              <el-input
                v-model="editingSetting.homeBigBannerDesc"
                placeholder="请输入描述文案"
                @change="onChangeField('homeBigBannerDesc', $event)"
              >
                <template #prepend>
                  描述
                </template>
              </el-input>
            </div>
            <el-divider content-position="left">
              <el-tag>按钮1</el-tag>
            </el-divider>
            <div class="line">
              <el-input
                v-model="editingSetting.homeBigBannerBtn1Label"
                placeholder="请输入按钮1文案"
                @change="onChangeField('homeBigBannerBtn1Label', $event)"
              >
                <template #prepend>
                  按钮1文案
                </template>
              </el-input>
            </div>
            <div class="line">
              <el-input
                v-model="editingSetting.homeBigBannerBtn1Link"
                placeholder="请输入按钮1链接"
                @change="onChangeField('homeBigBannerBtn1Link', $event)"
              >
                <template #prepend>
                  按钮1链接
                </template>
              </el-input>
            </div>
            <el-divider content-position="left">
              <el-tag>按钮2</el-tag>
            </el-divider>
            <div class="line">
              <el-input
                v-model="editingSetting.homeBigBannerBtn2Label"
                placeholder="请输入按钮2文案"
                @change="onChangeField('homeBigBannerBtn2Label', $event)"
              >
                <template #prepend>
                  按钮2文案
                </template>
              </el-input>
            </div>
            <div class="line">
              <el-input
                v-model="editingSetting.homeBigBannerBtn2Link"
                placeholder="请输入按钮2链接"
                @change="onChangeField('homeBigBannerBtn2Link', $event)"
              >
                <template #prepend>
                  按钮2链接
                </template>
              </el-input>
            </div>
          </div>
        </div>

        <el-alert
          title="首页搜索框下方广告位设置"
          type="info"
          effect="dark"
          :closable="false"
          style="margin-bottom:20px;margin-top:20px;"
        />
        <div class="page-header">
          <div class="header-left">
            <div class="line">
              <el-input
                v-model="editingSetting.homeTopAdImageLink"
                placeholder="请输入图片链接"
                @change="onChangeField('homeTopAdImageLink', $event)"
              >
                <template #prepend>
                  图片链接
                </template>
              </el-input>
            </div>
            <div class="line">
              <el-input
                v-model="editingSetting.homeTopAdJumpLink"
                placeholder="请输入跳转链接"
                @change="onChangeField('homeTopAdJumpLink', $event)"
              >
                <template #prepend>
                  跳转链接
                </template>
              </el-input>
            </div>
          </div>
          <div class="avatar-wrapper">
            <span
              v-if="!editingSetting.homeTopAdImageLink"
              class="note"
            >点击上传图片</span>
            <div
              v-if="editingSetting.homeTopAdImageLink"
              class="image-preview"
              :style="{ backgroundImage: `url('${editingSetting.homeTopAdImageLink}')` }"
            />
            <input
              ref="siteLogoRef"
              type="file"
              class="field-file"
              accept="image/*"
              @change="onChangeHomeTopAdImageLink"
            >
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
const activeTabName = ref('global')
const siteLogoRef = ref<InstanceType<typeof HTMLInputElement>>()

const editingSetting = ref<TS.ISiteSetting>({
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
  homeTopAdJumpLink: ''
})

const siteSettingStore = useSiteSettingStore()
const { siteSetting } = storeToRefs(siteSettingStore)

watch(
  () => siteSetting.value,
  () => {
    const keys = Object.keys(siteSetting.value) as Array<keyof TS.ISiteSetting>
    keys.forEach((key) => {
      editingSetting.value[key] = siteSetting.value[key]
    })
  },
  {
    immediate: true, deep: true
  }
)

const onChangeField = async (fieldName: keyof TS.ISiteSetting, value: string) => {
  const { code, message, data } = await $fetch<TS.IResponse<string>>(`/api/admin/siteSetting/${fieldName}`, {
    method: 'PUT',
    body: {
      value,
    }
  })
  if (code !== 200) {
    ElMessage.warning(message)
    editingSetting.value[fieldName] = siteSetting.value[fieldName]
    return
  }
  ElMessage.success(message)
  editingSetting.value[fieldName] = data
  await siteSettingStore.fetchSiteSetting()
}

const uploadImage = async (e: any): Promise<string> => {
  const fieldFile = siteLogoRef.value
  if (!fieldFile) {
    return ''
  }
  const files = e.target?.files || []
  if (files.length === 0) {
    return ''
  }
  const file = files[0]
  const formData = new FormData()
  formData.append('file', file)
  fieldFile.value = ''
  const { code, message, data } = await $fetch<TS.IResponse<{ url: string }>>('/api/file/image', {
    method: 'POST',
    body: formData,
  })
  if (code !== 200) {
    ElMessage.warning(message)
    return ''
  }
  ElMessage.success(message)
  return data.url
}

const onChangeSiteLogo = async (e: any) => {
  const url = await uploadImage(e)
  if (!url) {
    return
  }
  await onChangeField('siteLogo', url)
}
const onChangeHomeTopAdImageLink = async (e: any) => {
  const url = await uploadImage(e)
  if (!url) {
    return
  }
  await onChangeField('homeTopAdImageLink', url)
}
</script>

<style lang="scss" scoped>
.page-setting {
  display: block;
  max-width: 1200px;
  margin: 20px auto;
  :deep(.el-tabs__content) {
    background-color: #ffffff;
    padding: 15px;
  }
  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .header-left {
      display: block;
      flex: 1;
      flex-shrink: 0;
      .line {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 15px;
        &:nth-of-type(n + 2) {
          margin-top: 15px;
        }
      }
    }
    .avatar-wrapper {
      position: relative;
      display: block;
      width: 180px;
      height: 180px;
      flex-shrink: 0;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;
      margin-left: 20px;
      .note {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        line-height: 178px;
        text-align: center;
      }
      .image-preview {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background: transparent scroll no-repeat center center;
        background-size: cover;
      }
      .field-file {
        position: absolute;
        z-index: 2;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
        appearance: none;
        opacity: 0;
      }
    }
  }
  .abstract-wrapper {
    display: block;
    margin-top: 15px;
  }
}
</style>
