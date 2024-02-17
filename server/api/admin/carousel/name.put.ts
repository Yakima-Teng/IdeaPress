import { Op } from 'sequelize'
import { Carousel } from '~/server/models/carousel'
import { replyFailure, replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const id = Number(body.id)
  const name = body.name

  if (!id) {
    return replyFailure('id不可为空')
  }
  if (!name) {
    return replyFailure('条目名不可为空')
  }

  // 不允许出现同名的条目
  const findOne = await Carousel.findOne({
    where: {
      name,
      id: {
        [Op.not]: id,
      },
    }
  })
  if (findOne) {
    return replyFailure('已存在同名的条目')
  }

  const carousel = await Carousel.findOne({ where: { id } })
  if (!carousel) {
    return replyFailure('该id未找到匹配的条目')
  }
  await carousel.update({ name })

  return replySuccess('成功更新条目名称', carousel)
})
