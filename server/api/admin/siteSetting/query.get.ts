import { Op } from 'sequelize'
import { Dictionary } from "~/server/models/dictionary";
import { Menu } from "~/server/models/menu";
import { Carousel } from "~/server/models/carousel";
import { replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async () => {
  const keys = [
    'siteTitle',
    'siteDesc',
    'siteBeian',
    'siteKeywords',
    'siteSubTitle',
    'siteLogo',
    'siteCopyright',
    'siteTitleSeparator',
    'homeTitle',
    'homeDesc',
    'homeKeywords',
    'homeBigBannerTitle',
    'homeBigBannerDesc',
    'homeBigBannerBtn1Label',
    'homeBigBannerBtn1Link',
    'homeBigBannerBtn2Label',
    'homeBigBannerBtn2Link',
    'homeTopAdImageLink',
    'homeTopAdJumpLink',
  ]

  const [list, menus, carousels] = await Promise.all([
    Dictionary.findAll({
      where: {
        key: {
          [Op.in]: keys
        }
      },
    }),
    Menu.findAll({
      where: {
        position: 'main',
      },
      order: [
        ['order', 'ASC'],
      ]
    }),
    Carousel.findAll({
      where: {
        position: 'homeTop',
      },
      order: [
        ['order', 'ASC'],
      ]
    })
  ])

  const getKeyValue = (key: string): string => {
    const item = list.find((d) => d.key === key)
    return item?.value || ''
  }

  const returnData = keys.reduce((prev, key) => {
    prev[key] = getKeyValue(key)
    return prev
  }, {} as Record<string, string>)

  return replySuccess('查询网站设置信息成功', {
    ...returnData,
    menus,
    carousels,
  })
})
