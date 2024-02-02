<template>
  <div class="page-post">
    <div class="page-header">
      <div class="header-left">
        <div class="line">
          <el-input
            v-model="title"
            placeholder="请输入文章标题"
          >
            <template #prepend>
              标题（必填）
            </template>
          </el-input>
        </div>

        <div class="line">
          <el-input
            v-model="author"
            placeholder="请输入作者（可选）"
          >
            <template #prepend>
              作者（可选）
            </template>
          </el-input>
        </div>
        <div class="line">
          <el-input
            v-model="source"
            placeholder="请输入来源出处（可选）"
          >
            <template #prepend>
              来源（可选）
            </template>
          </el-input>
        </div>
        <div class="line">
          <el-select
            v-model="status"
            placeholder="请选择文章状态"
          >
            <el-option
              v-for="item in [{ value: '', label: '请选择文章状态' }].concat(OptionsPostStatus)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <el-select
            v-model="catId"
            placeholder="请选择文章分类"
          >
            <el-option
              v-for="item in [{ value: 0, label: '请选择文章分类' }].concat(optionsPostCat)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <el-button-group>
            <el-button
              type="primary"
              @click="toSave"
            >
              {{ route.query.id ? '更新' : '添加' }}并返回
            </el-button>
            <el-button
              type="danger"
              @click="toReturn"
            >
              直接返回
            </el-button>
          </el-button-group>
        </div>
      </div>
      <div class="avatar-wrapper">
        <span
          v-if="!cover"
          class="note"
        >点击上传缩略图</span>
        <div
          v-if="cover"
          class="image-preview"
          :style="{ backgroundImage: `url('${cover}')` }"
        />
        <input
          ref="coverRef"
          type="file"
          class="field-file"
          accept="image/*"
          @change="onCoverChange"
        >
      </div>
    </div>

    <div class="tags-wrapper">
      <el-input
        v-model="tag"
        placeholder="请输入标签（可选，多个标签以英文逗号分隔）"
      >
        <template #prepend>
          标签（可选，多个标签以英文逗号分隔）
        </template>
      </el-input>
    </div>

    <div class="abstract-wrapper">
      <el-input
        v-model="abstract"
        :rows="2"
        type="textarea"
        placeholder="请输入摘要信息（必填）"
      >
        <template #prepend>
          标题（必填）
        </template>
      </el-input>
    </div>

    <client-only>
      <div class="editor-wrapper">
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :default-config="toolbarConfig"
          :mode="mode"
        />
        <Editor
          v-model="valueHtml"
          style="height: 500px; overflow-y: hidden;"
          :default-config="editorConfig"
          :mode="mode"
          @on-created="handleCreated"
        />
      </div>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef } from 'vue'
import type { IEditorConfig, IToolbarConfig } from "@wangeditor/editor"
// import { DomEditor } from "@wangeditor/editor";
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { OptionsPostStatus } from '~/constants/options'

// mode: default or simple
const mode = 'default'
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

const route = useRoute()
const router = useRouter()
const cover = ref('')
const title = ref('')
const status = ref('')
const catId = ref(0)
const author = ref('')
const source = ref('')
const tag = ref('')
const abstract = ref('')
const optionsPostCat =  ref<TS.IOption<number>[]>([])
// 内容 HTML
const valueHtml = ref('')

const toolbarConfig: Partial<IToolbarConfig> = {}
const editorConfig: Partial<IEditorConfig> = {
  readOnly: false,
  autoFocus: true,
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadVideo: {
      async customUpload(file: File, insertFn: any) {
        const formData = new FormData()
        formData.append('file', file)
        const { code, message, data } = await $fetch<TS.IResponse<{ url: string }>>('/api/file/video', {
          method: 'POST',
          body: formData,
        })
        if (code !== 200) {
          ElMessage.warning(message)
          return
        }
        ElMessage.success(message)
        insertFn(data.url)
      }
    },
    uploadImage: {
      async customUpload(file: File, insertFn: any) {
        const formData = new FormData()
        formData.append('file', file)
        const { code, message, data } = await $fetch<TS.IResponse<{ url: string }>>('/api/file/image', {
          method: 'POST',
          body: formData,
        })
        if (code !== 200) {
          ElMessage.warning(message)
          return
        }
        ElMessage.success(message)
        insertFn(data.url)
      }
    },
  }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  // console.log(DomEditor.getToolbar(editor))
  console.log(editor.getMenuConfig('uploadImage'))
}

const toReturn = async () => {
  await ElMessageBox.confirm(
      '确定要直接返回吗，当前修改内容将会被丢弃',
      '注意',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
  router.back()
}

const toSave = async () => {
  const body: Omit<TS.IPost, 'id'> = {
    cover: cover.value || 'https://www.baidu.com',
    title: title.value,
    author: author.value,
    source: source.value,
    status: status.value,
    catId: catId.value,
    tag: tag.value
      .replace(/，/g, ',')
      .replace(/\s/g, ''),
    abstract: abstract.value,
    content: valueHtml.value,
  }
  const id = route.query.id
  // 新增
  if (!id) {
    const { code, message } = await $fetch<TS.IResponse<TS.IPost>>('/api/admin/post', {
      method: 'POST',
      body,
    })
    if (code !== 200) {
      ElMessage.warning(message)
      return
    }
    ElMessage.success(message)
    router.back()
    return
  }
  // 修改
  if (id) {
    const { code, message } = await $fetch<TS.IResponse<TS.IPost>>('/api/admin/post', {
      method: 'PUT',
      body: {
        ...body,
        id,
      },
    })
    if (code !== 200) {
      ElMessage.warning(message)
      return
    }
    ElMessage.success(message)
    router.back()
  }
}

const getPostData = async () => {
  const id = Number(route.query.id)
  const { code, message, data } = await $fetch<TS.IResponse<TS.IPost>>('/api/admin/post', {
    method: 'GET',
    query: {
      id,
    }
  })
  if (code !== 200) {
    ElMessage.warning(message)
    return
  }
  ElMessage.success(message)
  title.value = data.title
  cover.value = data.cover
  author.value = data.author
  source.value = data.source
  catId.value = data.catId
  abstract.value = data.abstract
  valueHtml.value = data.content
  status.value = data.status
  tag.value = data.tag
}

const coverRef = ref<InstanceType<typeof HTMLInputElement>>()
const onCoverChange = async (e: any) => {
  const fieldFile = coverRef.value
  if (!fieldFile) {
    return
  }
  const files = e.target?.files || []
  if (files.length === 0) {
    return
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
    return
  }
  ElMessage.success(message)
  cover.value = data.url
}

onMounted(async () => {
  const { code, message, data } = await $fetch<TS.IResponse<{ count: number; rows: TS.IPostCat[] }>>('/api/admin/postCats', {
    method: 'GET',
  })
  if (code !== 200) {
    ElMessage.warning(message)
    return
  }
  optionsPostCat.value = data.rows.map((row) => {
    return {
      value: row.id,
      label: row.name,
    }
  })
  if (route.query.id) {
    await getPostData()
  }
})
</script>

<style lang="scss" scoped>
.page-post {
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
