import { Op } from 'sequelize'
import { Dictionary } from "~/server/models/dictionary";
import { replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async () => {
  const keys = [
    'siteTitle',
    'siteDesc',
    'siteBeian',
    'siteKeywords',
    'siteSubTitle',
    'siteLogo',
    'siteCopyright'
  ]

  const list = await Dictionary.findAll({
    where: {
      key: {
        [Op.in]: keys
      }
    },
  })

  const getKeyValue = (key: string): string => {
    const item = list.find((d) => d.key === key)
    return item?.value || ''
  }

  const returnData = keys.reduce((prev, key) => {
    prev[key] = getKeyValue(key)
    return prev
  }, {} as Record<string, string>)

  return replySuccess('查询网站设置信息成功', returnData)
})
