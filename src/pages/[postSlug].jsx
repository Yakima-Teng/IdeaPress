import React  from 'react'
import PropTypes from 'prop-types'
import fetch from 'isomorphic-fetch'
import Layout from '../components/frontend/Layout'
import { seo } from '../../site.config'

const Post = (props) => {
    const post = props.post
    return (
        <Layout
            hideSiteMainTitle={true}
            pageTitle={post.post_title || ''}
            keywords={seo.keywords}
            description={seo.description}>
            <div className="blog-post">
                <h1 className="blog-post-title">
                    <a href={`/${props.postSlug}.html`}>{post.post_title}</a>
                </h1>
                <p className="blog-post-meta">发布时间：{post.post_date.replace(/T.*$/, '')}, 目录：{post.cat_name}</p>
                <article className="postContent" dangerouslySetInnerHTML={{ __html: post.post_content }} />
            </div>

            <style jsx>{`
                    .blog-post {
                        margin-bottom: 60px;
                    }
                    .blog-post-title {
                        margin-bottom: 5px;
                        font-size: 40px;
                    }
                    .blog-post-meta {
                        margin-bottom: 20px;
                        color: #999;
                    }
                `}</style>
        </Layout>
    )
}

Post.propTypes = {
    postSlug: PropTypes.string.isRequired,
    post: PropTypes.object.isRequired,
}

Post.getInitialProps = async ({ req, query }) => {
    const postSlug = query.postSlug.replace(/\.html$/, '')

    const baseUrl = req ? `http://${req.headers.host}` : ''
    const res = await fetch(`${baseUrl}/api/v1/posts/${postSlug}?type=slug`)
    const data = await res.json()
    const post = ((body) => ({
        cat_name: body.cat_name,
        cat_slug: body.cat_slug,
        post_content: body.post_content,
        post_date: body.post_date,
        post_id: body.post_id,
        post_title: body.post_title,
    }))(data.body)

    return {
        postSlug,
        post,
    }
}

export default Post
