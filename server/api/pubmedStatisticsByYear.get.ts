import axios from 'axios'
import * as cheerio from 'cheerio'
import { replyFailure, replySuccess } from '~/server/scripts/utils'

const mapRangeNumberAndFieldName = {
  'L1': 'Title',
  'L2': 'Author',
  'L3': 'Title/Abstract',
  'L4': 'Text Word',
  'L5': 'Journal',
}

/**
 * 查询pubmed文章列表
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event) || {}
  const keyword = String(query.keyword || '')
  if (!keyword) {
    return replyFailure('请输入关键词')
  }
  const rangeNum = `L${Number(query.range || 1)}` as keyof typeof mapRangeNumberAndFieldName
  const range = mapRangeNumberAndFieldName[rangeNum]
  const baseUrl = 'https://pubmed.ncbi.nlm.nih.gov/'
  const res = await axios({
    url: baseUrl,
    method: 'get',
    params: {
      term: `(${keyword}[${range}])`,
    },
  })
  if (res.status !== 200) {
    return []
  }
  const html = res.data
  const $ = cheerio.load(html)
  const tableRows = $('#timeline-table tbody tr')
  const tableData = []
  for (let i = 0, len = tableRows.length; i < len; i++) {
    const row = tableRows.eq(i)
    const tds = row.find('td')
    const year = Number(tds.eq(0).text().trim())
    const num = Number(tds.eq(1).text().trim())
    tableData.push({ year, num })
  }

  return replySuccess('查询列表成功', tableData)
})
