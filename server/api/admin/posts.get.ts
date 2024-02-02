import { Op } from 'sequelize'
import { Post } from '~/server/models/post'
import { replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const query = getQuery(event) || {}
  const pageNum = Number(query.pageNum || 1)
  const pageSize = Number(query.pageSize || 10)
  const keyword = query.keyword || ''

  const list = await Post.findAndCountAll({
    where: {
      title: {
        [Op.like]: `%${keyword}%`
      }
    },
    offset: (pageNum - 1) * pageSize,
    limit: pageSize,
  })

  return replySuccess('查询文章分页列表成功', list)
})
