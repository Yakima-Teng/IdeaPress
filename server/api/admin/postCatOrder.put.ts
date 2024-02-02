import { PostCat } from '~/server/models/postCat'
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
  const findCat = await PostCat.findOne({
    where: {
      id,
    }
  })
  if (!findCat) {
    return replyFailure('该分类不存在')
  }

  const postCat = await PostCat.findOne({ where: { id } })
  if (!postCat) {
    return replyFailure('未找到与该id匹配的文章分类')
  }
  await postCat.update({
    order,
  })

  return replySuccess('成功更新分类排序', postCat)
})
