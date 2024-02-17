import { Menu } from '~/server/models/menu'
import { replyFailure, replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const id = Number(body.id)
  const order = Number(body.order)

  if (!id) {
    return replyFailure('id不可为空')
  }
  if (!order && order !== 0) {
    return replyFailure('序号不可为空')
  }
  const menu = await Menu.findOne({
    where: {
      id,
    }
  })
  if (!menu) {
    return replyFailure('该菜单不存在')
  }

  await menu.update({
    order,
  })

  return replySuccess('成功更新菜单排序', menu)
})
