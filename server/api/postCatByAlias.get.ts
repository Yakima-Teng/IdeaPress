import { replySuccess } from '~/server/scripts/utils'
import { PostCat } from '~/server/models/postCat'

/**
 * 按文章分类别名查询文章分类详情
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event) || {}
  const alias = query.alias as string

  const postCat = await PostCat.findOne({
    where: {
      alias,
    }
  })

  return replySuccess('成功文章分类详情成功', postCat)
})
