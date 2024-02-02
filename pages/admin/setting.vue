<template>
  <div class="page-setting">
    <el-alert
      title="网站设置"
      type="info"
      effect="dark"
      :closable="false"
      style="margin-bottom:30px;"
    />

    <div class="page-header">
      <div class="header-left">
        <div class="line">
          <el-input
            v-model="siteTitle"
            placeholder="请输入网站标题"
            @change="onChangeSiteTitle"
          >
            <template #prepend>
              网站标题（必填）
            </template>
          </el-input>
        </div>

        <div class="line">
          <el-input
            v-model="siteSubTitle"
            placeholder="请输入网站副标题（可选）"
            @change="onChangeSiteSubTitle"
          >
            <template #prepend>
              网站副标题（可选）
            </template>
          </el-input>
        </div>
        <div class="line">
          <el-input
            v-model="siteBeian"
            placeholder="请输入备案信息（可选）"
            @change="onChangeSiteBeian"
          >
            <template #prepend>
              备案信息（可选）
            </template>
          </el-input>
        </div>
        <div class="line tags-wrapper">
          <el-input
            v-model="siteKeywords"
            placeholder="请输入网站关键词（可选，多个关键词以英文逗号分隔）"
            @change="onChangeSiteKeywords"
          >
            <template #prepend>
              网站关键词（可选，多个关键词以英文逗号分隔）
            </template>
          </el-input>
        </div>
      </div>
      <div class="avatar-wrapper">
        <span
          v-if="!siteLogo"
          class="note"
        >点击上传网站图标</span>
        <div
          v-if="siteLogo"
          class="image-preview"
          :style="{ backgroundImage: `url('${siteLogo}')` }"
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
      <el-input
        v-model="siteDesc"
        :rows="2"
        type="textarea"
        placeholder="请输入网站描述（选填）"
        @change="onChangeSiteDesc"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const siteTitle = ref('')
const siteSubTitle = ref('')
const siteDesc = ref('')
const siteKeywords = ref('')
const siteBeian = ref('')
const siteLogoRef = ref<InstanceType<typeof HTMLInputElement>>()
const siteLogo = ref('')

const rawData = ref<TS.ISiteSetting>({
  siteTitle: '',
  siteSubTitle: '',
  siteDesc: '',
  siteKeywords: '',
  siteBeian: '',
  siteLogo: '',
})

const querySetting = async () => {
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
  rawData.value = data
  siteTitle.value = data.siteTitle
  siteBeian.value = data.siteBeian
  siteDesc.value = data.siteDesc
  siteKeywords.value = data.siteKeywords
  siteSubTitle.value = data.siteSubTitle
  siteLogo.value = data.siteLogo
}

await querySetting()

const onChangeSiteTitle = async (value: string) => {
  if (!value) {
    ElMessage.warning('网站标题不可为空')
    siteTitle.value = rawData.value.siteTitle
    return
  }
  const { code, message, data } = await $fetch<TS.IResponse<string>>('/api/admin/siteSetting/siteTitle', {
    method: 'PUT',
    body: {
      value,
    }
  })
  if (code !== 200) {
    ElMessage.warning(message)
    siteTitle.value = rawData.value.siteTitle
    return
  }
  ElMessage.success(message)
  siteTitle.value = data
}

const onChangeSiteSubTitle = async (value: string) => {
  const { code, message, data } = await $fetch<TS.IResponse<string>>('/api/admin/siteSetting/siteSubTitle', {
    method: 'PUT',
    body: {
      value,
    }
  })
  if (code !== 200) {
    ElMessage.warning(message)
    siteSubTitle.value = rawData.value.siteSubTitle
    return
  }
  ElMessage.success(message)
  siteSubTitle.value = data
}

const onChangeSiteBeian = async (value: string) => {
  const { code, message, data } = await $fetch<TS.IResponse<string>>('/api/admin/siteSetting/siteBeian', {
    method: 'PUT',
    body: {
      value,
    }
  })
  if (code !== 200) {
    ElMessage.warning(message)
    siteBeian.value = rawData.value.siteBeian
    return
  }
  ElMessage.success(message)
  siteBeian.value = data
}

const onChangeSiteKeywords = async (value: string) => {
  const { code, message, data } = await $fetch<TS.IResponse<string>>('/api/admin/siteSetting/siteKeywords', {
    method: 'PUT',
    body: {
      value,
    }
  })
  if (code !== 200) {
    ElMessage.warning(message)
    siteKeywords.value = rawData.value.siteKeywords
    return
  }
  ElMessage.success(message)
  siteKeywords.value = data
}

const onChangeSiteDesc = async (value: string) => {
  const { code, message, data } = await $fetch<TS.IResponse<string>>('/api/admin/siteSetting/siteDesc', {
    method: 'PUT',
    body: {
      value,
    }
  })
  if (code !== 200) {
    ElMessage.warning(message)
    siteDesc.value = rawData.value.siteDesc
    return
  }
  ElMessage.success(message)
  siteDesc.value = data
}

const uploadSiteLogo = async (e: any): Promise<string> => {
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
  const url = await uploadSiteLogo(e)
  if (!url) {
    return
  }
  const { code, message, data } = await $fetch<TS.IResponse<string>>('/api/admin/siteSetting/siteLogo', {
    method: 'PUT',
    body: {
      value: url,
    }
  })
  if (code !== 200) {
    ElMessage.warning(message)
    siteLogo.value = rawData.value.siteLogo
    return
  }
  ElMessage.success(message)
  siteLogo.value = data
}
</script>

<style lang="scss" scoped>
.page-setting {
  display: block;
  max-width: 1200px;
  margin: 20px auto;
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
        z-index: -1;
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
  .editor-wrapper {
    z-index: 10;
    display: block;
    margin-top: 15px;
    border: 1px solid #cccccc;
  }
}
</style>
