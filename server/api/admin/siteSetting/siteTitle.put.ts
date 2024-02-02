import { Dictionary } from "~/server/models/dictionary";
import { replyFailure, replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
  const key = 'siteTitle'
  const value = body.value
  const label = '网站标题'

  if (!value) {
    return replyFailure(`${label}不可为空`)
  }
  const [findOne, created] = await Dictionary.findOrCreate({
    where: {
      key,
    },
    defaults: {
      key,
      value,
    }
  })
  if (!created) {
    await findOne.update({ value })
  }

  return replySuccess(`成功更新${label}`, findOne.value)
})
