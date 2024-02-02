import jwt from 'jsonwebtoken'
import { checkPasswordEquality, encrypt, replyFailure, replySuccess } from '~/server/scripts/utils'
import { UUIDCode } from '~/server/models/uuidCode'
import { User } from '~/server/models/user'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const username = body.username
  const password = body.password
  const uuid = body.uuid
  const code = body.code

  if (!username || !password) {
    return replyFailure('登录账号和密码不得为空')
  }
  if (!uuid) {
    return replyFailure('uuid不存在，请刷新页面重试')
  }
  if (!code) {
    return replyFailure('图片验证码不得为空')
  }

  const uuidCode = await UUIDCode.findOne({
    where: {
      uuid,
    }
  })
  if (!uuidCode) {
    return replyFailure('uuid对应图片验证码不存在，请刷新页面重试')
  }
  if (code !== uuidCode.code) {
    return replyFailure('图片验证码错误')
  }

  let user: User | null

  // 同时支持用户名登录和邮箱地址登录，如果客户端传入的username包含@符号，则判断为邮箱地址登录
  const isEmail = username.includes('@')
  if (isEmail) {
    user = await User.findOne({
      where: {
        email: username,
      }
    })
  } else {
    user = await User.findOne({
      where: {
        username,
      }
    })
  }

  if (!user) {
    // 这里不需要提示具体是账号不存在还是账号密码不正确给用户，给一个模糊的提醒即可，否则会增加被盗号风险
    return replyFailure('用户不存在，或账号、密码不正确')
  }

  const databasePassword = user.getDataValue('password')
  const encryptedPassword = encrypt(password)
  const isPasswordCorrect = checkPasswordEquality(databasePassword, encryptedPassword)

  if (!isPasswordCorrect) {
    return replyFailure('用户不存在，或账号、密码不正确')
  }

  // 生成token
  const tokenPayload = {
    userId: user.id,
    username: user.username,
    role: user.role,
  }
  const token = jwt.sign(tokenPayload, useRuntimeConfig().jwtSecret, {
    expiresIn: '72h',
  })

  // 登录完毕后，异步删除数据库中的uuid对应记录
  UUIDCode.destroy({
    where: {
      uuid,
    }
  }).catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err)
  })

  setCookie(event, 'token', token)

  return replySuccess('成功获取token', token)
})
