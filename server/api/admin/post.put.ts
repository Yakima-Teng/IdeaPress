import { Op } from 'sequelize'
import { PostCat } from '~/server/models/postCat'
import { replyFailure, replySuccess } from '~/server/scripts/utils'
import { Post } from '~/server/models/post'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const id = Number(body.id)
  const title = body.title || ''
  const cover = body.cover || ''
  const abstract = body.abstract || ''
  const content = body.content || ''
  const status = body.status || ''
  const catId = Number(body.catId)
  const author = body.author || ''
  const source = body.source || ''
  const tag = body.tag || ''

  if (!id) {
    return replyFailure('id不可为空')
  }
  if (!title) {
    return replyFailure('文章标题不可为空')
  }
  if (!cover) {
    return replyFailure('文章封面图不可为空')
  }
  if (!abstract) {
    return replyFailure('文章摘要不可为空')
  }
  if (!content) {
    return replyFailure('文章内容不可为空')
  }
  if (!status) {
    return replyFailure('文章发布状态不可为空')
  }
  if (!['草稿', '已发布'].includes(status)) {
    return replyFailure('文章发布状态有误')
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
    cover,
    title,
    abstract,
    content,
    status,
    catId,
    author,
    source,
    tag,
  })

  return replySuccess('成功更新文章', post)
})
