import { Post } from '~/server/models/post'
import { PostCat } from '~/server/models/postCat'
import { replyFailure, replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const query = getQuery(event) || {}
  const id = Number(query.id)

  if (!id) {
    return replyFailure('id不可为空')
  }

  const post = await Post.findOne({
    where: { id },
    include: [
      {
        // 指定关联的model
        model: PostCat,
        // 由于前面建立映射关系时为class表起了别名，那么这里也要与前面保持一致，否则会报错
        as:'postCat',
        // 这里的attributes属性表示查询class表的name和rank字段，其中对name字段起了别名className
        attributes: ['id', 'name', 'alias'],
      }
    ]
  })
  if (!post) {
    return replyFailure('该id未找到匹配的文章')
  }

  return replySuccess('查询文章详情成功', post)
})
