import { PostCat } from '~/server/models/postCat'
import { replyFailure, replySuccess } from '~/server/scripts/utils'
import { Post } from '~/server/models/post'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const id = Number(body.id)
  const catId = Number(body.catId)

  if (!id) {
    return replyFailure('id不可为空')
  }
  if (!catId) {
    return replyFailure('文章分类不可为空')
  }
  const findCat = await PostCat.findOne({
    where: {
      id: catId,
    }
  })
  if (!findCat) {
    return replyFailure('该分类不存在')
  }

  const post = await Post.findOne({ where: { id } })
  if (!post) {
    return replyFailure('未找到与该id匹配的文章')
  }
  await post.update({
    catId,
  })

  return replySuccess('成功更新文章所属分类', post)
})
