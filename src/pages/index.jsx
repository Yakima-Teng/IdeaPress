import React  from 'react'
import Markdown from 'react-markdown'
import Layout from '../components/frontend/Layout'
import { seo } from '../../site.config'

const MarkdownText = `
# 峰间的云

## 欢迎访问我的博客。

${'```'}javascript
if (num > 0) {
    return 1
} else {
    return 0
}
${'```'}  
`

const Page = () => {
    return (
        <Layout
            hideSiteMainTitle={true}
            pageTitle={''}
            keywords={seo.keywords}
            description={seo.description}>
            <Markdown source={MarkdownText} />
        </Layout>
    )
}

export default Page
