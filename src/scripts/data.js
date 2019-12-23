// 文章发布状态
import {
    imageDomainUsed,
    imagePrefix,
} from '../../site.config'

export const PostStatus = [
    { value: '1', text: '草稿' },
    { value: '2', textCn: '已发布' },
    { value: '3', textCn: '已删除' },
]

export const imgPrefix = imageDomainUsed + imagePrefix

export const numOfPostsPerPage = 10
