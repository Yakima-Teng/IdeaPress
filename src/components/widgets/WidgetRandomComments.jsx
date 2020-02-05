import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

export const WidgetRandomComments = (props) => (
    <div className="row sidebarWidget">
        <h4>随机评论</h4>
        <ol className="list-unstyled">
            {
                props.commentList.map((item, idx) => (
                    <li className="linkWrapper" key={idx}>
                        <Link href={item.href}>
                            <a
                                title={item.title}
                                target="_self">{item.contentPrefix}</a>
                        </Link>
                        {item.contentDetail}
                    </li>
                ))
            }
        </ol>

        <style jsx>{`
            .linkWrapper:nth-of-type(n+2) {
                margin-top: 6px;
            }
        `}</style>
    </div>
)

WidgetRandomComments.propTypes = {
    commentList: PropTypes.arrayOf(PropTypes.shape({
        href: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        contentPrefix: PropTypes.string.isRequired,
        contentDetail: PropTypes.string.isRequired,
    })).isRequired,
}
