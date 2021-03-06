import React  from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { doGet } from '../../scripts/fetch'
import { Siblings } from '../../components/post/Siblings'

const Post = (props) => {
    const post = props.post
    return (
        <Layout
            pageTitle={post.post_title || ''}
            keywords={[post.post_title]}
            description={props.post.post_content.substr(0, 66)}
            blogInfo={props.blogInfo}
            userInfo={props.userInfo}
            categoryList={props.categoryList}
            months={props.months}
            links={props.links}
            randomPosts={props.randomPosts}
            randomComments={props.randomComments}
        >
            <div className="blog-post">
                <h1 className="blog-post-title">
                    <Link
                        href={`/templates/post?postType=${props.query.postType}&postName=${props.query.postName}`}
                        as={`/${props.postSlug}${props.isPost === true ? '.html' : ''}`}
                    >
                        <a className="h3">{post.post_title}</a>
                    </Link>
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

            {
                props.isPost === true && (
                    <Siblings
                        nextText={props.post.nextPost ? props.post.nextPost.post_title : ''}
                        nextLink={props.post.nextPost ? `/${encodeURIComponent(props.post.nextPost.post_name)}.html` : ''}
                        prevText={props.post.prevPost ? props.post.prevPost.post_title : ''}
                        prevLink={props.post.prevPost ? `/${encodeURIComponent(props.post.prevPost.post_name)}.html` : ''}
                    />
                )
            }

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
            <style jsx global>{`
                .postContent img {
                    max-width: 100%;
                    height: auto;
                }
            `}</style>
        </Layout>
    )
}

Post.propTypes = {
    blogInfo: PropTypes.object.isRequired,
    userInfo: PropTypes.object.isRequired,
    categoryList: PropTypes.array.isRequired,
    months: PropTypes.array.isRequired,
    links: PropTypes.array.isRequired,
    randomPosts: PropTypes.array.isRequired,
    randomComments: PropTypes.array.isRequired,

    isPost: PropTypes.bool.isRequired,
    postSlug: PropTypes.string.isRequired,
    post: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
}

Post.getInitialProps = async ({ query }) => {
    const resForBasicInfo = await doGet('/api/v2/getBasicInfo')
    const dataForBasicInfo = await resForBasicInfo.json()
    const {
        blogInfo, userInfo, categoryList, months, links, randomPosts, randomComments,
    } = dataForBasicInfo.body

    const postName = query.postName
    const postType = query.postType
    const isPost = postType === 'post'

    const res = await doGet('/api/v2/getPostData', {
        postName,
        postType,
    })
    const data = await res.json()
    const post = ((body) => ({
        cat_name: body.post.category.length > 0 ? body.post.category[0].name : '',
        cat_slug: body.post.category.length > 0 ? body.post.category[0].slug : '',
        post_content: body.post.post_content,
        post_date: body.post.post_date,
        post_id: body.post.ID,
        post_title: body.post.post_title,
        prevPost: body.prevPost,
        nextPost: body.nextPost,
    }))(data.body)

    return {
        blogInfo,
        userInfo,
        categoryList,
        months,
        links,
        randomPosts,
        randomComments,
        isPost,
        postSlug: postName,
        post,
        query,
    }
}

export default Post
