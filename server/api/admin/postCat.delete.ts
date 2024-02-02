import { PostCat } from '~/server/models/postCat'
import { Post } from '~/server/models/post'
import { replyFailure, replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const id = Number(body.id)

  if (!id) {
    return replyFailure('id不可为空')
  }

  const postCat = await PostCat.findOne({ where: { id } })
  if (!postCat) {
    return replyFailure('该id未找到匹配的文章分类')
  }

  const findOne = await Post.findOne({
    where: {
      catId: id,
    }
  })
  if (findOne) {
    return replyFailure('该分类下还存在文章，不可直接删除分类，请先将文章移到其他分类下')
  }

  await postCat.destroy()

  return replySuccess('成功删除文章分类', postCat)
})
