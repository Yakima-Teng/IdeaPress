import { Post } from '~/server/models/post'
import { replyFailure, replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const id = Number(body.id)

  if (!id) {
    return replyFailure('id不可为空')
  }

  const post = await Post.findOne({ where: { id } })
  if (!post) {
    return replyFailure('该id未找到匹配的文章')
  }
  await post.destroy()

  return replySuccess('成功删除文章分类', post)
})
