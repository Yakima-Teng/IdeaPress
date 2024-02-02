import { Op } from 'sequelize'
import { PostCat } from '~/server/models/postCat'
import { replyFailure, replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const id = Number(body.id)
  const name = body.name

  if (!id) {
    return replyFailure('id不可为空')
  }
  if (!name) {
    return replyFailure('分类名不可为空')
  }

  // 不允许出现同名的分类目录
  const findOne = await PostCat.findOne({
    where: {
      name,
      id: {
        [Op.not]: id,
      },
    }
  })
  if (findOne) {
    return replyFailure('已存在同名的分类目录')
  }

  const postCat = await PostCat.findOne({ where: { id } })
  if (!postCat) {
    return replyFailure('该id未找到匹配的文章分类')
  }
  await postCat.update({ name })

  return replySuccess('成功更新分类名称', postCat)
})
