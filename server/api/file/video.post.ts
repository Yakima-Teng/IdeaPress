import fs from 'fs'
import path from 'path'
import {replyFailure, replySuccess} from '~/server/scripts/utils'

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event) || []
  if (files.length === 0) {
    return replyFailure('请上传文件')
  }
  const file = files[0]
  const { name, type, data } = file
  const filename = file.filename || `${Date.now()}`
  const publicPath = useRuntimeConfig().publicPath
  // 保存图片的目录
  const saveDirectory = path.join(publicPath, 'videos')
  // 如果目录不存在则新建目录
  if (!fs.existsSync(saveDirectory)) {
    fs.mkdirSync(saveDirectory)
  }
  // 在目录下保存图片文件
  fs.writeFileSync(path.join(saveDirectory, filename), data)
  return replySuccess('图片已上传成功', {
    name,
    type,
    filename,
    url: `/videos/${filename}`,
  })
})
