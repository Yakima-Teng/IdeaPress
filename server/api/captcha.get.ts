import svgCaptcha from 'svg-captcha'
import { v4 as uuidv4 } from 'uuid'
import { UUIDCode } from '~/server/models/uuidCode'
import { replySuccess } from '~/server/scripts/utils'

export default defineEventHandler(async () => {
  const captcha = svgCaptcha.createMathExpr({
    mathMin: 1,
    mathMax: 9,
    mathOperator: '+-',
    background: '#ffffff',
    color: true,
    width: 144,
    height: 48
  })
  const uuid = uuidv4()
  // captcha.text的值是计算结果字符串，如'-4'、'2'
  await UUIDCode.create({
    uuid,
    code: captcha.text,
  })

  return replySuccess('成功获取图片验证码',{
    uuid,
    svgString: captcha.data,
  })
})
