import { Menu } from "~/server/models/menu";
import { replyFailure, replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const id = Number(body.id)

  if (!id) {
    return replyFailure('id不可为空')
  }

  const menu = await Menu.findOne({ where: { id } })
  if (!menu) {
    return replyFailure('该id未找到匹配的菜单')
  }

  await menu.destroy()

  return replySuccess('成功删除菜单', menu)
})
