import { Op } from 'sequelize'
import { PostCat } from '~/server/models/postCat'
import { replyFailure, replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const id = Number(body.id)
  const alias = body.alias

  if (!id) {
    return replyFailure('id不可为空')
  }
  if (!alias) {
    return replyFailure('别名不可为空')
  }

  // 不允许出现同别名的分类目录
  const findOne = await PostCat.findOne({
    where: {
      alias,
      id: {
        [Op.not]: id,
      },
    }
  })
  if (findOne) {
    return replyFailure('已存在同别名的分类目录')
  }

  const postCat = await PostCat.findOne({ where: { id } })
  if (!postCat) {
    return replyFailure('该id未找到匹配的文章分类')
  }
  await postCat.update({ alias })

  return replySuccess('成功更新分类别名', postCat)
})
