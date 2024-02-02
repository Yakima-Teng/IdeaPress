<template>
  <div class="page-posts">
    <div class="page-header">
      <div class="header-left">
        <el-button
          type="primary"
          @click="toAdd"
        >
          新增
        </el-button>
        <el-input
          v-model="keyword"
          class="field-input"
          placeholder="请输入标题关键词搜索"
        >
          <template #append>
            <el-button
              :icon="Search"
              @click="toSearchKeyword"
            />
          </template>
        </el-input>
      </div>
      <div class="header-right">
        <el-config-provider
          size="large"
          :z-index="3000"
          :locale="zhCn"
        >
          <el-pagination
            v-model:current-page="current"
            v-model:page-size="limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :page-sizes="[10, 20, 50, 100]"
            :small="true"
            :background="true"
            @current-change="onCurrentChange"
            @size-change="onSizeChange"
          />
        </el-config-provider>
      </div>
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
          prop="title"
          label="标题"
          width="auto"
          header-align="center"
          align="left"
        >
          <template #default="{ row }">
            <el-input
              v-model="row.title"
              @change="onChangeRowTitle($event, row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="catId"
          label="分类目录"
          width="auto"
          header-align="center"
          align="center"
        >
          <template #default="{ row }">
            <el-select
              :model-value="row.catId"
              @change="onChangeRowCatId($event, row)"
            >
              <el-option
                v-for="item in optionsCat"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="发布状态"
          width="auto"
          header-align="center"
          align="center"
        >
          <template #default="{ row }">
            <el-select
              :model-value="row.status"
              @change="onChangeRowStatus($event, row)"
            >
              <el-option
                v-for="item in optionsStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
              @click="toEdit(row)"
            >
              编辑
            </el-button>
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
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const router = useRouter()
const keyword = ref('')
const total = ref(0)
const current = ref(1)
const limit = ref(10)

const optionsCat = ref<TS.IOption<number>[]>([
  { value: 1, label: '分类1' },
  { value: 2, label: '分类2' },
  { value: 3, label: '分类3' },
])
const optionsStatus = ref<TS.IOption<string>[]>([
  { value: '草稿', label: '草稿' },
  { value: '已发布', label: '已发布' },
])

const tableData = ref<TS.IPost[]>([])

const getListData = async () => {
  const { code, message, data } = await $fetch<TS.IResponse<{ count: number; rows: TS.IPost[] }>>('/api/admin/posts', {
    method: 'GET',
    query: {
      pageNum: current.value,
      pageSize: limit.value,
      keyword: keyword.value,
    }
  })
  if (code !== 200) {
    ElMessage.warning(message)
    return
  }
  tableData.value = data.rows
  total.value = data.count
}

const toSearchKeyword = async () => {
  current.value = 1
  total.value = 0
  tableData.value = []
  await getListData()
}

const onCurrentChange = (pageNum: number) => {
  current.value = pageNum
  getListData()
}

const onSizeChange = () => {
  current.value = 1
  getListData()
}

const toEdit = (row: TS.IPostCat) => {
  router.push({
    path: '/admin/post',
    query: {
      id: row.id,
    }
  })
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
  const { code, message } = await $fetch('/api/admin/post', {
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
  await getListData()
}

const toAdd = () => {
  router.push({
    path: '/admin/post',
    query: {},
  })
}

const onChangeRowTitle = async (value: string, row: TS.IPost) => {
  const { code, message, data } = await $fetch<TS.IResponse<TS.IPost>>('/api/admin/postTitle', {
    method: 'PUT',
    body: {
      id: row.id,
      title: value,
    }
  })
  if (code !== 200) {
    ElMessage.warning(message)
    await getListData()
    return
  }
  ElMessage.success(message)
  row.title = data.title
}

const onChangeRowCatId = async (value: number, row: TS.IPost) => {
  const { code, message, data } = await $fetch<TS.IResponse<TS.IPost>>('/api/admin/postCatId', {
    method: 'PUT',
    body: {
      id: row.id,
      catId: value,
    }
  })
  if (code !== 200) {
    ElMessage.warning(message)
    await getListData()
    return
  }
  ElMessage.success(message)
  row.catId = data.catId
}

const onChangeRowStatus = async (value: number, row: TS.IPost) => {
  const { code, message, data } = await $fetch<TS.IResponse<TS.IPost>>('/api/admin/postStatus', {
    method: 'PUT',
    body: {
      id: row.id,
      status: value,
    }
  })
  if (code !== 200) {
    ElMessage.warning(message)
    await getListData()
    return
  }
  ElMessage.success(message)
  row.status = data.status
}

const updateOptionsCat = async () => {
  const { code, message, data } = await $fetch<TS.IResponse<{ count: number; rows: TS.IPostCat[] }>>('/api/admin/postCats', {
    method: 'GET',
  })
  if (code !== 200) {
    ElMessage.warning(message)
    return
  }
  optionsCat.value = data.rows.map((item) => {
    return {
      value: item.id,
      label: item.name,
    }
  })
}

onMounted(() => {
  updateOptionsCat()
  getListData()
})
</script>

<style lang="scss" scoped>
.page-posts {
  display: block;
  max-width: 1200px;
  margin: 20px auto;
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-left {
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      gap: 15px;
    }
    .header-right {
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      gap: 15px;
      .field-input {
        width: 300px;
      }
    }
  }
  .page-body {
    display: block;
    margin-top: 20px;
  }
}
</style>
