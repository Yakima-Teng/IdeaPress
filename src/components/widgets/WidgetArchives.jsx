import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

export const WidgetArchives = (props) => (
    <div className="row sidebarWidget">
        <h4>月度存档</h4>
        <ol className="list-unstyled clearfix">
            {
                props.months.map((item, idx) => (
                    <li className="archive" key={idx}>
                        <Link href={`/${item.year}/${item.month}`}>
                            <a>{item.year}年{item.month * 1}月({item.numOfPosts})</a>
                        </Link>
                    </li>
                ))
            }
        </ol>

        <style jsx>{`
            .archive {
                float: left;
                min-width: 50%;
            }
        `}</style>
    </div>
)

WidgetArchives.propTypes = {
    months: PropTypes.arrayOf(PropTypes.shape({
        year: PropTypes.string.isRequired,
        month: PropTypes.string.isRequired,
        numOfPosts: PropTypes.number.isRequired,
    })).isRequired,
}
