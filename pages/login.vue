<template>
  <div class="page-login">
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
            @keyup.enter="toLogin"
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
            @keyup.enter="toLogin"
          />
        </el-form-item>
        <el-form-item
          prop="verifyCode"
          label="验证码"
        >
          <el-input
            v-model.trim="verifyCode"
            type="text"
            size="default"
            placeholder="请输入图片计算结果"
            :maxlength="120"
            @keyup.enter="toLogin"
          >
            <template #suffix>
              <!-- eslint-disable vue/no-v-html -->
              <div
                v-if="verifyCodeUrl"
                class="svg-wrapper"
                @click="updateVerifyCodeUrl"
                v-html="verifyCodeUrl"
              />
              <!-- eslint-enable vue/no-v-html -->
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            size="default"
            class="btn-submit"
            type="primary"
            block
            @click.prevent="toLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="extra-action">
        还没账号？前去
        <div
          class="btn"
          @click="toRegister"
        >
          注册
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

const token = useCookie('token')
const router = useRouter()

const { siteTitle } = useRuntimeConfig().public

useHead({
  title: '登录'
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
  verifyCode: [
    {
      required: true,
      message: '请输入图片验证码',
      trigger: 'blur',
    },
  ],
}
const formRef = ref<any>(null)
const account = ref('')
const password = ref('')
const uuid = ref('')
const verifyCode = ref('')

const formModel = computed(() => {
  return {
    account: account.value,
    password: password.value,
    verifyCode: verifyCode.value,
  }
})

const verifyCodeUrl = ref('')
const updateVerifyCodeUrl = async () => {
  const { code, message, data } = await $fetch<{ code: number; message: string; data: null | { svgString: string; uuid: string } }>('/api/captcha')
  if (code !== 200) {
    ElMessage.warning(message)
    return
  }
  if (data) {
    verifyCodeUrl.value = data.svgString
    uuid.value = data.uuid
  }
}
updateVerifyCodeUrl()

const toLogin = async () => {
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
    uuid: uuid.value,
    code: verifyCode.value,
  }
  const { code, message, data } = await $fetch<{ code: number; message: string; data: null | string }>('/api/login', {
    method: 'POST',
    body: requestData,
  })
  if (code !== 200) {
    ElMessage.warning(message)
    return
  }
  token.value = data
  router.push({
    path: '/',
    query: {},
  })
}

const toRegister = () => {
  router.push({
    path: '/register',
    query: {},
  })
}

onMounted(() => {
  updateVerifyCodeUrl()
})
</script>

<style lang="scss" scoped>
.page-login {
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
    .svg-wrapper {
      width: 144px;
      height: 47px;
      margin-top: -2px;
      margin-right: -8px;
      overflow: hidden;
      user-select: none;
      cursor: pointer;
      transform: scale(0.75);
      transform-origin: right bottom;
      position: absolute;
      bottom: 1px;
      right: 0;
    }
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
