<template>
  <div class="page-post-cats">
    <div class="page-header">
      <el-button
        type="primary"
        @click="toAdd"
      >
        新增
      </el-button>
      <el-input
        v-model="keyword"
        class="field-input"
        placeholder="请输入关键词搜索"
      >
        <template #append>
          <el-button :icon="Search" />
        </template>
      </el-input>
    </div>
    <div class="page-body">
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="id"
          width="180"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="name"
          label="名称"
          width="auto"
          header-align="center"
          align="left"
        >
          <template #default="{ row }">
            <el-input
              v-model="row.name"
              @change="onChangeRowName($event, row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="link"
          label="轮播图（建议尺寸600*300）"
          width="auto"
          header-align="center"
          align="left"
        >
          <template #default="{ row }">
            <div class="avatar-wrapper">
              <span
                v-if="!row.img"
                class="note"
              >点击上传图片</span>
              <div
                v-if="row.img"
                class="image-preview"
                :style="{ backgroundImage: `url('${row.img}')` }"
              />
              <input
                type="file"
                class="field-file"
                accept="image/*"
                @change="onChangeRowImg($event, row)"
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="link"
          label="跳转地址"
          width="auto"
          header-align="center"
          align="left"
        >
          <template #default="{ row }">
            <el-input
              v-model="row.link"
              @change="onChangeRowLink($event, row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="position"
          label="显示位置"
          width="auto"
          header-align="center"
          align="center"
        >
          <template #default="{ row }">
            <el-select
              :model-value="row.position"
              @change="onChangeRowPosition($event, row)"
            >
              <el-option
                v-for="item in [{ value: 'homeTop', label: '首页顶部' }]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="order"
          label="排序号（从小到大）"
          width="auto"
          header-align="center"
          align="center"
        >
          <template #default="{ row }">
            <el-input-number
              v-model="row.order"
              @change="onChangeRowOrder($event, row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="160"
          align="center"
        >
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              size="small"
              @click="toDelete(row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'

const keyword = ref('')
const position = ref('')

const tableData = ref<TS.IPostCat[]>([])
const siteSettingStore = useSiteSettingStore()

const getPostCatList = async () => {
  await siteSettingStore.fetchSiteSetting()
  const { code, message, data } = await $fetch<TS.IResponse<{ count: number; rows: TS.IPostCat[] }>>('/api/admin/carousel/carousels', {
    method: 'GET',
    query: {
      keyword: keyword.value,
      position: position.value,
    },
  })
  if (code !== 200) {
    ElMessage.warning(message)
    return
  }
  tableData.value = data.rows
}

const toDelete = async (id: number) => {
  await ElMessageBox.confirm(
    '确定要删除吗？该操作不可逆。',
    '注意',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  const { code, message } = await $fetch<TS.IResponse<TS.IPostCat>>('/api/admin/carousel/carousel', {
    method: 'DELETE',
    body: {
      id,
    }
  })
  if (code !== 200) {
    ElMessage.warning(message)
    return
  }
  ElMessage.success(message)
  await getPostCatList()
}

const toAdd = async () => {
  const { value } = await ElMessageBox.prompt('请输入名称', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern:
      /.+/,
    inputErrorMessage: '名称不可为空',
  })
  const { code, message } = await $fetch<TS.IResponse<TS.IPostCat>>('/api/admin/carousel/carousel', {
    method: 'POST',
    body: {
      name: value,
    }
  })
  if (code !== 200) {
    ElMessage.warning(message)
    await getPostCatList()
    return
  }
  ElMessage.success(message)
  await getPostCatList()
}

const onChangeRowName = async (value: string, row: TS.IPostCat) => {
  const { code, message, data } = await $fetch<TS.IResponse<TS.IPostCat>>('/api/admin/carousel/name', {
    method: 'PUT',
    body: {
      id: row.id,
      name: value,
    }
  })
  if (code !== 200) {
    ElMessage.warning(message)
    await getPostCatList()
    return
  }
  ElMessage.success(message)
  row.name = data.name
  await getPostCatList()
}

const uploadImage = async (e: any): Promise<string> => {
  const fieldFile = e.target
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

const onChangeRowImg = async (e: any, row: TS.ICarousel) => {
  const url = await uploadImage(e)
  if (!url) {
    return
  }
  const { code, message, data } = await $fetch<TS.IResponse<TS.IPostCat>>('/api/admin/carousel/img', {
    method: 'PUT',
    body: {
      id: row.id,
      img: url,
    }
  })
  if (code !== 200) {
    ElMessage.warning(message)
    await getPostCatList()
    return
  }
  ElMessage.success(message)
  row.img = data.img
  await getPostCatList()
}

const onChangeRowLink = async (value: string, row: TS.IPostCat) => {
  const { code, message, data } = await $fetch<TS.IResponse<TS.IPostCat>>('/api/admin/carousel/link', {
    method: 'PUT',
    body: {
      id: row.id,
      link: value,
    }
  })
  if (code !== 200) {
    ElMessage.warning(message)
    await getPostCatList()
    return
  }
  ElMessage.success(message)
  row.name = data.name
  await getPostCatList()
}

const onChangeRowPosition = async (value: number, row: TS.IPostCat) => {
  const { code, message, data } = await $fetch<TS.IResponse<TS.IPostCat>>('/api/admin/carousel/position', {
    method: 'PUT',
    body: {
      id: row.id,
      position: value,
    }
  })
  if (code !== 200) {
    ElMessage.warning(message)
    await getPostCatList()
    return
  }
  ElMessage.success(message)
  row.position = data.position
  await getPostCatList()
}

const onChangeRowOrder = async (value: string, row: TS.IPostCat) => {
  const { code, message } = await $fetch<TS.IResponse<TS.IPostCat>>('/api/admin/carousel/order', {
    method: 'PUT',
    body: {
      id: row.id,
      order: value,
    }
  })
  if (code !== 200) {
    ElMessage.warning(message)
    await getPostCatList()
    return
  }
  ElMessage.success(message)
  await getPostCatList()
}

onMounted(async () => {
  await getPostCatList()
})
</script>

<style lang="scss" scoped>
.page-post-cats {
  display: block;
  max-width: 1200px;
  margin: 20px auto;
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .field-input {
      width: 300px;
    }
  }
  .page-body {
    display: block;
    margin-top: 20px;
  }
  .avatar-wrapper {
    position: relative;
    display: block;
    width: 120px;
    height: 120px;
    flex-shrink: 0;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    .note {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
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
</style>
