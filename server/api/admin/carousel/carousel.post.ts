import { Carousel } from '~/server/models/carousel'
import { replyFailure, replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const name = body.name

  if (!name) {
    return replyFailure('名称不可为空')
  }
  // 不允许出现同名
  const findOne = await Carousel.findOne({
    where: {
      name,
    }
  })
  if (findOne) {
    return replyFailure('已存在同名的条目')
  }

  const carousel = await Carousel.create({
    name,
    img: '',
    link: '',
    order: 0,
    position: 'homeTop',
  })

  return replySuccess('成功增加条目', carousel)
})
