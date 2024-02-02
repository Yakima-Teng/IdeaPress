import {encrypt, replyFailure, replySuccess, saltPassword} from '~/server/scripts/utils'
import { User } from '~/server/models/user'
import { Dictionary } from "~/server/models/dictionary";

/**
 * 初始化项目，比如添加管理员账号
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const siteTitle = body.siteTitle
  const username = body.username
  const password = body.password
  const email = body.email

  if (!siteTitle) {
    return replyFailure('请填写网站标题')
  }
  if (!username) {
    return replyFailure('请填写用户名')
  }
  if (!password) {
    return replyFailure('请填写管理员密码')
  }
  if (!email) {
    return replyFailure('请填写邮箱地址')
  }
  if (!/^.+@.+$/.test(email)) {
    return replyFailure('邮箱地址格式有误，请仔细核对')
  }

  // 如果不存在管理员，则创建管理员
  const saltedPassword = saltPassword(encrypt(password))
  const [userAdmin, created] = await User.findOrCreate({
    where: { role: "ADMIN" },
    defaults: {
      username: username,
      password: saltedPassword,
      displayName: username,
      avatar: '',
      email,
      phone: '',
      role: "ADMIN",
    },
  });
  if (created) {
    await Dictionary.create({
      key: 'siteTitle',
      value: siteTitle,
    })
    console.log(`管理员账号已新建：${JSON.stringify(userAdmin.toJSON())}`);
    return replySuccess('已完成初始化，请注释掉/api/init接口')
  }
  console.log(`管理员账号已存在：${JSON.stringify(userAdmin.toJSON())}`);
  return replyFailure('初始化失败，因为管理员账号已存在，请登录后在后台进行修改')
})
