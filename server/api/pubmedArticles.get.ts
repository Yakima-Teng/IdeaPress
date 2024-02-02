import ncbi from 'node-ncbi'
import { replyFailure, replySuccess } from '~/server/scripts/utils'

const mapRangeNumberAndFieldName = {
  'L1': 'Title',
  'L2': 'Author',
  'L3': 'Title/Abstract',
  'L4': 'Text Word',
  'L5': 'Journal',
}

// eUtils now requires API keys to make more than three requests per second
// process.env.NCBI_API_KEY = ''

/**
 * 查询pubmed文章列表
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event) || {}
  const pageNum = Number(query.no || 1)
  const pageSize = Number(query.size || 10)
  const keyword = String(query.kw || '')
  if (!keyword) {
    return replyFailure('请输入关键词')
  }
  const rangeNum = `L${Number(query.range || 1)}` as keyof typeof mapRangeNumberAndFieldName
  const queryString = `${keyword}[${mapRangeNumberAndFieldName[rangeNum]}]`
  const results = await ncbi.pubmed.search(queryString, pageNum - 1, pageSize);
  return replySuccess('查询列表成功', results)
})
