import { Dictionary } from "~/server/models/dictionary";
import { replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
  const key = 'siteSubTitle'
  const value = body.value
  const label = '网站副标题'

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
