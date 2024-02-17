import { Carousel } from "~/server/models/carousel";
import { replyFailure, replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const id = Number(body.id)

  if (!id) {
    return replyFailure('id不可为空')
  }

  const carousel = await Carousel.findOne({ where: { id } })
  if (!carousel) {
    return replyFailure('该id未找到匹配项')
  }

  await carousel.destroy()

  return replySuccess('成功删除轮播图', carousel)
})
