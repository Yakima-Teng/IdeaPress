import { Carousel } from '~/server/models/carousel'
import { replyFailure, replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const id = Number(body.id)
  const img = body.img

  if (!id) {
    return replyFailure('id不可为空')
  }
  if (!img) {
    return replyFailure('图片地址不可为空')
  }

  const carousel = await Carousel.findOne({ where: { id } })
  if (!carousel) {
    return replyFailure('该id未找到匹配的条目')
  }
  await carousel.update({ img })

  return replySuccess('成功更新条目图片地址', carousel)
})
