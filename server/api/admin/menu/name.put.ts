import { Op } from 'sequelize'
import { Menu } from '~/server/models/menu'
import { replyFailure, replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const id = Number(body.id)
  const name = body.name

  if (!id) {
    return replyFailure('id不可为空')
  }
  if (!name) {
    return replyFailure('菜单名不可为空')
  }

  // 不允许出现同名的菜单
  const findOne = await Menu.findOne({
    where: {
      name,
      id: {
        [Op.not]: id,
      },
    }
  })
  if (findOne) {
    return replyFailure('已存在同名的菜单')
  }

  const menu = await Menu.findOne({ where: { id } })
  if (!menu) {
    return replyFailure('该id未找到匹配的菜单')
  }
  await menu.update({ name })

  return replySuccess('成功更新菜单名称', menu)
})
