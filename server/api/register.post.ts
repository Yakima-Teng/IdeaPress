import jwt from 'jsonwebtoken'
import { encrypt, replyFailure, replySuccess, saltPassword} from '~/server/scripts/utils'
import { User } from '~/server/models/user'
import {EmailCode} from "~/server/models/emailCode";

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const username = body.username

  if (/(admin)|(管理)|(master)|(站长)|(网站)/.test(username.toLowerCase())) {
    return replyFailure('用户名请不要包含特殊内容')
  }

  const password = body.password
  const email = body.email
  const code = body.code

  if (!username || !password) {
    return replyFailure('登录账号和密码不得为空')
  }
  if (password.length < 6) {
    return replyFailure('密码长度不应小于6位')
  }
  if (!email) {
    return replyFailure('请输入邮箱')
  }
  if (!/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(email)) {
    return replyFailure('邮箱地址有误，请仔细核对')
  }
  if (!code) {
    return replyFailure('邮箱验证码不得为空')
  }

  const emailCode = await EmailCode.findOne({
    where: {
      email,
    }
  })
  if (!emailCode) {
    return replyFailure('邮箱对应验证码不存在，请先获取验证码')
  }
  if (code !== emailCode.code) {
    // eslint-disable-next-line no-console
    console.log(`正确的验证码应该是: ${emailCode.code}`)
    return replyFailure('验证码错误')
  }
  let user = await User.findOne({
    where: {
      username,
    }
  })
  if (user) {
    return replyFailure('该用户名已被占用，请换一个用户名')
  }
  user = await User.findOne({
    where: {
      email,
    }
  })
  if (user) {
    return replyFailure('该邮箱已被使用，请换一个邮箱')
  }

  user = await User.create({
    username,
    email,
    displayName: username,
    phone: '',
    avatar: '',
    // 普通用户
    role: 'NORMAL',
    password: saltPassword(encrypt(password)),
  })

  // 注册完毕后，清空邮箱验证码
  await emailCode.destroy()

  // 生成token
  const tokenPayload = {
    userId: user.id,
    username: user.username,
    role: user.role,
  }
  const token = jwt.sign(tokenPayload, useRuntimeConfig().jwtSecret, {
    expiresIn: '72h',
  })

  setCookie(event, 'token', token)

  return replySuccess('注册成功', token)
})
