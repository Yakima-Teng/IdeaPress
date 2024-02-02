import { replySuccess } from '~/server/scripts/utils'
import { PostCat } from '~/server/models/postCat'
import { Post } from '~/server/models/post'

/**
 * 按文章分类查询各分类下近期文章
 */
export default defineEventHandler(async () => {
  // 主栏文章分类
  const postCatGroups = await PostCat.findAll({
    where: {
      position: 'sidebar',
    },
    order: [['order', 'ASC']],
    include: [
      {
        // 指定关联的model
        model: Post,
        // 由于前面建立映射关系时为class表起了别名，那么这里也要与前面保持一致，否则会报错
        as: 'posts',
        where: {
          status: '已发布',
        },
        order: [['createdAt', 'DESC']],
        limit: 5,
      }
    ]
  })

  // 没有已发布文章的分类不需要显示
  const finalPostCatGroups = postCatGroups.filter((cat) => {
    // @ts-ignore
    return cat.posts.length > 0
  })

  return replySuccess('成功侧栏各分类下的近期文章成功', finalPostCatGroups)
})
