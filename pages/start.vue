<template>
  <div class="page-start">
    <div class="card">
      <div class="tip">
        填写以下信息，创建你自己的站点！除管理员用户名外，其他字段稍后都可以在后台进行修改。
      </div>
      <el-form
        ref="formRef"
        class="form"
        :rules="formRules"
        :model="formModel"
        label-position="top"
      >
        <el-form-item
          prop="siteTitle"
          label="网站标题"
        >
          <el-input
            v-model.trim="siteTitle"
            size="default"
            placeholder="请输入网站标题"
            :maxlength="20"
            @keyup.enter="toStart"
          />
        </el-form-item>
        <el-form-item
          prop="username"
          label="用户名"
        >
          <el-input
            v-model.trim="username"
            size="default"
            placeholder="请输入用户名"
            :maxlength="20"
            @keyup.enter="toStart"
          />
        </el-form-item>
        <el-form-item
          prop="password"
          label="密码"
        >
          <el-input
            v-model.trim="password"
            type="password"
            size="default"
            placeholder="请输入密码"
            :maxlength="120"
            show-password
            @keyup.enter="toStart"
          />
        </el-form-item>

        <el-form-item
          prop="email"
          label="邮箱"
        >
          <el-input
            v-model.trim="email"
            size="default"
            placeholder="请输入邮箱"
            :maxlength="20"
            @keyup.enter="toStart"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            size="default"
            class="btn-submit"
            type="primary"
            block
            @click.prevent="toStart"
          >
            创建我的站点
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
const formRef = ref<any>(null)
const siteTitle = ref('')
const username = ref('')
const password = ref('')
const email = ref('')
const router = useRouter()

useHead({
  title: '初始化',
})

const formRules = {
  siteTitle: [
    {
      required: true,
      message: '请输入网站标题',
      trigger: 'blur',
    }
  ],
  username: [
    {
      required: true,
      message: '请输入管理员用户名',
      trigger: 'blur',
    }
  ],
  password: [
    {
      required: true,
      message: '请输入管理员密码',
      trigger: 'blur'
    }
  ],
  email: [
    {
      required: true,
      message: '请输入邮箱地址',
      trigger: 'blur'
    }
  ]
}

interface IFormModel {
  siteTitle: string
  username: string
  password: string
  email: string
}
// https://cn.vuejs.org/guide/best-practices/performance.html#computed-stability
const formModel = computed<IFormModel>((oldValue?: IFormModel) => {
  const newValue: IFormModel = {
    siteTitle: siteTitle.value,
    username: username.value,
    password: password.value,
    email: email.value,
  }
  if (oldValue && JSON.stringify(oldValue) === JSON.stringify(newValue)) {
    return oldValue
  }
  return newValue
})

const toStart = async () => {
  ElMessage.closeAll()
  const $ref = formRef.value
  if (!$ref) return
  const valid = await new Promise((resolve) => [
    $ref.validate((isValid: boolean) => {
      resolve(isValid)
    }),
  ])
  if (!valid) return
  const { code, message } = await $fetch<{ code: number; message: string; data: null | string }>('/api/init', {
    method: 'POST',
    body: formModel.value,
  })
  if (code !== 200) {
    ElMessage.warning(message)
  }
  router.push({
    path: '/',
    query: {},
  })
}
</script>

<style lang="scss" scoped>
.page-start {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  .card {
    display: block;
    max-width: 800px;
    margin: 0 auto;
    background-color: #ffffff;
    padding: 20px;
    .tip {
      margin-bottom: 20px;
    }
    .btn-submit {
      margin-top: 30px;
    }
  }
}
</style>
