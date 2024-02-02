import { Post } from '~/server/models/post'
import { PostCat } from '~/server/models/postCat'
import { replyFailure, replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const title = body.title || ''
  const cover = body.cover || ''
  const abstract = body.abstract || ''
  const content = body.content || ''
  const status = body.status || ''
  const catId = Number(body.catId)
  const author = body.author || ''
  const source = body.source || ''
  const tag = body.tag || ''

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

  // 不允许出现相同的文章标题
  const findOne = await Post.findOne({
    where: {
      title,
    }
  })
  if (findOne) {
    return replyFailure('已存在相同的文章标题')
  }

  const post = await Post.create({
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

  return replySuccess('成功新增文章', post)
})
