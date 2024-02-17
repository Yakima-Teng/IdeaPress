import { Menu } from '~/server/models/menu'
import { replyFailure, replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const name = body.name

  if (!name) {
    return replyFailure('菜单名不可为空')
  }
  // 不允许出现同名的分类目录
  const findOne = await Menu.findOne({
    where: {
      name,
    }
  })
  if (findOne) {
    return replyFailure('已存在同名的菜单')
  }

  const menu = await Menu.create({
    name,
    link: '',
    order: 0,
    position: 'main',
  })

  return replySuccess('成功增加菜单', menu)
})
