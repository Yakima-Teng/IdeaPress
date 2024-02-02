import { Op } from 'sequelize'
import { replyFailure, replySuccess } from '~/server/scripts/utils'
import { Post } from '~/server/models/post'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const id = Number(body.id)
  const title = body.title || ''

  if (!id) {
    return replyFailure('id不可为空')
  }
  if (!title) {
    return replyFailure('文章标题不可为空')
  }

  // 不允许出现同标题的文章
  const findOne = await Post.findOne({
    where: {
      title,
      id: {
        [Op.not]: id,
      },
    }
  })
  if (findOne) {
    return replyFailure('已存在同标题的文章')
  }

  const post = await Post.findOne({ where: { id } })
  if (!post) {
    return replyFailure('未找到与该id匹配的文章')
  }
  await post.update({
    title,
  })

  return replySuccess('成功更新文章标题', post)
})
