import React  from 'react'
import PropTypes from 'prop-types'
import Layout from '../components/Layout'
import { seo } from '../../site.config'
import { doGet } from '../scripts/fetch'

const Post = (props) => {
    const post = props.post
    return (
        <Layout
            pageTitle={post.post_title || ''}
            keywords={seo.keywords}
            description={seo.description}>
            <div className="blog-post">
                <h1 className="blog-post-title">
                    <a
                        className="h3"
                        href={`/${props.postSlug}${props.isPost === true ? '.html' : ''}`}
                    >{post.post_title}</a>
                </h1>
                <p className="blog-post-meta">
                    发布时间：{post.post_date.replace(/T.*$/, '')}
                    {
                        props.isPost === true && (
                            <span>, 目录：{post.cat_name}</span>
                        )
                    }
                </p>
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
    isPost: PropTypes.bool.isRequired,
    postSlug: PropTypes.string.isRequired,
    post: PropTypes.object.isRequired,
}

Post.getInitialProps = async ({ query }) => {
    const isPost = /\.html$/.test(query.postSlug) // .html结尾的是文章，不带.html的是页面
    const postSlug = query.postSlug.replace(/\.html$/, '')

    const res = await doGet(`/api/v1/${isPost ? 'posts' : 'pages'}/${postSlug}`, {
        type: 'slug',
    })
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
        isPost,
        postSlug,
        post,
    }
}

export default Post
