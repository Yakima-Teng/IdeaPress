import { Op } from 'sequelize'
import { Carousel } from '~/server/models/carousel'
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
  const list = await Carousel.findAndCountAll({
    where,
    order: [
      ['order', 'ASC'],
    ]
  })

  return replySuccess('成功查询所有符合条件的条目列表', list)
})
