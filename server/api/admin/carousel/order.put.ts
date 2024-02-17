import { Carousel } from '~/server/models/carousel'
import { replyFailure, replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const id = Number(body.id)
  const order = Number(body.order)

  if (!id) {
    return replyFailure('id不可为空')
  }
  if (!order && order !== 0) {
    return replyFailure('序号不可为空')
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
    order,
  })

  return replySuccess('成功更新条目排序', carousel)
})
