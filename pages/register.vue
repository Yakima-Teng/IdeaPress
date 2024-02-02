<template>
  <div class="page-register">
    <div class="content-wrapper">
      <div class="form-title">
        {{ siteTitle }}
      </div>
      <el-form
        ref="formRef"
        class="form"
        :rules="rules"
        :model="formModel"
        label-position="top"
      >
        <el-form-item
          prop="account"
          label="账号"
        >
          <el-input
            v-model.trim="account"
            size="default"
            placeholder="账号"
            :maxlength="120"
            @keyup.enter="toRegister"
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
            @keyup.enter="toRegister"
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
            :maxlength="120"
            @keyup.enter="toRegister"
          >
            <template #suffix>
              <el-button
                class="btn-send"
                type="primary"
                size="small"
                @click="sendEmailCode"
              >
                发送验证码
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          prop="verifyCode"
          label="邮箱验证码"
        >
          <el-input
            v-model.trim="verifyCode"
            type="text"
            size="default"
            placeholder="请输入邮箱验证码"
            :maxlength="120"
            @keyup.enter="toRegister"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            size="default"
            class="btn-submit"
            type="primary"
            block
            @click.prevent="toRegister"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>
      <div class="extra-action">
        已有账号？前去
        <div
          class="btn"
          @click="toLogin"
        >
          登录
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from "nuxt/app";

const router = useRouter()
const token = useCookie('token')

const { siteTitle } = useRuntimeConfig().public

useHead({
  title: '注册'
})

const rules = {
  account: [
    {
      required: true,
      message: '请输入您的账号',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入您的密码',
      trigger: 'blur',
    },
  ],
  email: [
    {
      required: true,
      message: '请输入邮箱',
      trigger: 'blur',
    },
  ],
  verifyCode: [
    {
      required: true,
      message: '请输入邮箱中收到的验证码',
      trigger: 'blur',
    },
  ],
}
const formRef = ref<any>(null)
const account = ref('')
const password = ref('')
const email = ref('')
const verifyCode = ref('')

const formModel = computed(() => {
  return {
    account: account.value,
    password: password.value,
    email: email.value,
    verifyCode: verifyCode.value,
  }
})

// 发送邮箱验证码
const sendEmailCode = async () => {
  const targetEmail = email.value
  if (!targetEmail) {
    ElMessage.error('请输入邮箱地址')
    return
  }
  if (!/^.+@.+$/.test(targetEmail)) {
    ElMessage.error('邮箱地址格式有误，请仔细核对')
    return
  }
  const { code, message } = await $fetch<{ code: number; message: string; data: null | boolean }>('/api/sendEmailCode', {
    method: 'POST',
    body: {
      email: targetEmail,
    },
  })
  if (code !== 200) {
    ElMessage.warning(message)
    return
  }
  ElMessage.success(message)
}

const toRegister = async () => {
  ElMessage.closeAll()
  const $ref = formRef.value
  if (!$ref) return
  const valid = await new Promise((resolve) => [
    $ref.validate((isValid: boolean) => {
      resolve(isValid)
    }),
  ])
  if (!valid) return
  const requestData = {
    username: account.value,
    password: password.value,
    email: email.value,
    code: verifyCode.value,
  }
  const { code, message, data } = await $fetch<{ code: number; message: string; data: null | string }>('/api/register', {
    method: 'POST',
    body: requestData,
  })
  if (code !== 200) {
    ElMessage.warning(message)
    return
  }
  token.value = data
  ElMessage.success(message)

  await router.push({
    path: '/',
    query: {},
  })
}

const toLogin = () => {
  router.push({
    path: '/login',
    query: {},
  })
}
</script>

<style lang="scss" scoped>
.page-register {
  width: 100vw;
  height: 100vh;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f5f6f8 url('@/assets/images/dna.jpg') scroll no-repeat center center;
  background-size: cover;
  .content-wrapper {
    display: block;
    width: 320px;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0.6);
    padding: 20px;
    border-radius: 8px;
  }
  .form-title {
    display: block;
    font-size: 32px;
    color: #000000;
    line-height: 1.5;
    text-align: center;
  }
  .form {
    width: 280px;
    margin: 0 auto;
    :deep(.el-form-item) {
      margin-bottom: 22px;
      &.is-error {
        .el-input__inner {
          border-color: #de2c2f;
        }
      }
    }
    :deep(.el-input) {
      .el-input__wrapper {
        position: relative;
        box-shadow: none;
        padding: 0;
        border-radius: 0;
      }
      .el-input__inner {
        height: 36px;
        padding: 0 8px;
      }
      .el-input__suffix {
        position: absolute;
        right: 8px;
        top: 0;
        .el-input__suffix-inner {
          display: flex !important;
          align-items: center;

          .btn-send {
            border-radius: 0;
          }
        }
        .el-input__validateIcon {
          display: none;
        }
      }
    }
    .btn-submit {
      width: 100%;
      border-radius: 0;
      height: 48px;
      border: none;
    }
  }
  .extra-action {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 12px;
    color: #333;
    line-height: 1.1;
    .btn {
      user-select: none;
      cursor: pointer;
      color: #1841f8;
    }
  }
}
</style>
