import React from 'react'
import PropTypes from 'prop-types'

export const PostList = (props) => {
    return (
        <div className="posts">
            {
                props.posts.map((item) => (
                    <div key={item.id} className="post">
                        <header className="postHeader">
                            <a href={`/${item.slug}.html`} className="postTitle">{item.title}</a>
                            <small className="postDate">{(item.modified || item.date).replace(/T.*$/, '')}</small>
                        </header>
                        <article className="postExcerpt" dangerouslySetInnerHTML={{ __html: item.excerpt || item.content }} />
                    </div>
                ))
            }
            <style jsx>{`
                .posts {
                    padding-left: 0;
                }
                .post {
                    display: block;
                    padding-top: 10px;
                    padding-bottom: 10px;
                }
                .post:nth-of-type(n+2) {
                    border-top: 1px dashed #7797a2;
                    margin-top: 10px;
                }
                .postHeader {
                    display: block;
                }
                .postHeader .postDate {
                    display: inline;
                    margin-left: 1em;
                }
                .postExcerpt {
                    display: block;
                    word-break: break-word;
                }
            `}</style>
            <style jsx global>{`
                .crayon-plain-wrap {
                    display: none;
                }
                p:nth-last-of-type(1) {
                    margin-bottom: 0;
                }
            `}</style>
        </div>
    )
}

PostList.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        modified: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        excerpt: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
    })).isRequired,
}
