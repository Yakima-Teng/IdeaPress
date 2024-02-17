import { Carousel } from '~/server/models/carousel'
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
  const carousel = await Carousel.findOne({
    where: {
      id,
    }
  })
  if (!carousel) {
    return replyFailure('该条目不存在')
  }

  await carousel.update({
    position,
  })

  return replySuccess('成功更新条目位置', carousel)
})
