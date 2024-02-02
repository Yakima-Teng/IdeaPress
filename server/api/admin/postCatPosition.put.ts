import { PostCat } from '~/server/models/postCat'
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
    position,
  })

  return replySuccess('成功更新分类位置', postCat)
})
