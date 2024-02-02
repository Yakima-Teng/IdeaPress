import { PostCat } from '~/server/models/postCat'
import { replyFailure, replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const name = body.name

  if (!name) {
    return replyFailure('分类名不可为空')
  }
  // 不允许出现同名的分类目录
  const findOne = await PostCat.findOne({
    where: {
      name,
    }
  })
  if (findOne) {
    return replyFailure('已存在同名的分类目录')
  }

  const postCat = await PostCat.create({
    name,
  })

  return replySuccess('成功增加文章分类', postCat)
})
