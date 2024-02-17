import { Menu } from '~/server/models/menu'
import { replyFailure, replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const id = Number(body.id)
  const position = body.position

  if (!id) {
    return replyFailure('id不可为空')
  }
  if (!position) {
    return replyFailure('位置不可为空')
  }
  const menu = await Menu.findOne({
    where: {
      id,
    }
  })
  if (!menu) {
    return replyFailure('该分类不存在')
  }

  await menu.update({
    position,
  })

  return replySuccess('成功更新菜单位置', menu)
})
