import { replyFailure, replySuccess } from '~/server/scripts/utils'
import { Post } from '~/server/models/post'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const id = Number(body.id)
  const status = body.status || ''

  if (!id) {
    return replyFailure('id不可为空')
  }
  if (!status) {
    return replyFailure('文章发布状态不可为空')
  }
  if (!['草稿', '已发布'].includes(status)) {
    return replyFailure('文章发布状态有误')
  }

  const post = await Post.findOne({ where: { id } })
  if (!post) {
    return replyFailure('未找到与该id匹配的文章')
  }
  await post.update({
    status,
  })

  return replySuccess('成功更新文章状态', post)
})
