import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

export const WidgetArchives = (props) => (
    <div className="row sidebarWidget">
        <h4>月度存档</h4>
        <ol className="list-unstyled">
            {
                props.months.map((item, idx) => (
                    <li key={idx}>
                        <Link href={`/${item.year}/${item.month}`}>
                            <a>{item.year}-{item.month} ({item.numOfPosts})</a>
                        </Link>
                    </li>
                ))
            }
        </ol>
    </div>
)

WidgetArchives.propTypes = {
    months: PropTypes.arrayOf(PropTypes.shape({
        year: PropTypes.string.isRequired,
        month: PropTypes.string.isRequired,
        numOfPosts: PropTypes.number.isRequired,
    })).isRequired,
}
