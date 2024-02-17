import { Op } from 'sequelize'
import { Menu } from '~/server/models/menu'
import { replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const query = getQuery(event) || {}
  const keyword = query.keyword || ''
  const location = query.location || ''

  const where: Record<string, unknown> = {}
  if (keyword) {
    where.name = {
      [Op.like]: `%${keyword}%`
    }
  }
  if (location) {
    where.location = location
  }
  const list = await Menu.findAndCountAll({
    where,
    order: [
      ['order', 'ASC'],
    ]
  })

  return replySuccess('成功查询所有符合条件的菜单列表', list)
})
