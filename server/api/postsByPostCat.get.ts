import { Op } from 'sequelize'
import { replySuccess } from '~/server/scripts/utils'
import { PostCat } from '~/server/models/postCat'
import { Post } from '~/server/models/post'

/**
 * 按文章分类查询各分类下近期文章
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event) || {}
  const pageNum = query.pageNum
  const pageSize = query.pageSize
  const keyword = query.keyword
  const catAlias = query.catAlias

  const queryCondition: Record<string, any> = {
    where: {
      status: '已发布',
    },
    order: [['createdAt', 'DESC']],
  }
  if (pageNum && pageSize) {
    queryCondition.offset = (Number(pageNum) - 1) * Number(pageSize)
    queryCondition.size = Number(pageSize)
  }
  if (keyword) {
    queryCondition.where.keyword = {
      [Op.like]: `%${keyword}%`,
    }
  }
  if (catAlias) {
    // 这个属性表示开启原生查询，原生查询支持的功能更多，自定义更强
    queryCondition.raw = true
    // include关键字表示关联查询
    queryCondition.include = [
      {
        // 指定关联的model
        model: PostCat,
        // 由于前面建立映射关系时为class表起了别名，那么这里也要与前面保持一致，否则会报错
        as:'postCat',
        // 这里的attributes属性表示查询class表的name和rank字段，其中对name字段起了别名className
        attributes: [['name', 'catName'], ['alias', 'catAlias']],
        where: {
          alias: catAlias,
        }
      }
    ]
  }

  const posts = await Post.findAndCountAll(queryCondition)

  return replySuccess('成功文章列表成功', posts)
})
