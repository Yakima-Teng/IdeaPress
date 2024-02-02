import { replyFailure, replySuccess } from '~/server/scripts/utils'
import { User } from '~/server/models/user'

/**
 * 查询当前登录用户的信息
 */
export default defineEventHandler(async (event) => {
  const userId = event.context.auth?.userId
  if (!userId) {
    return replyFailure('userId不存在')
  }
  const user = await User.findOne({
    where: {
      id: Number(userId),
    }
  })
  if (!user) {
    return replyFailure('获取用户信息失败')
  }
  return replySuccess('成功查询到用户信息', user)
})
