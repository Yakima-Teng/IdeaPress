import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

export const WidgetRandomPosts = (props) => (
    <div className="row sidebarWidget">
        <h4>随机文章</h4>
        <ol className="list-unstyled">
            {
                props.postList.map((item, idx) => (
                    <li className="linkWrapper" key={idx}>
                        <Link href={item.href}>
                            <a
                                title={item.title}
                                target="_self">{item.name}</a>
                        </Link>
                    </li>
                ))
            }
        </ol>

        <style jsx>{`
            .linkWrapper {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
            }
            .linkWrapper:nth-of-type(n+2) {
                margin-top: 6px;
            }
        `}</style>
    </div>
)

WidgetRandomPosts.propTypes = {
    postList: PropTypes.arrayOf(PropTypes.shape({
        href: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
}
