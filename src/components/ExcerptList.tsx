import React  from 'react'
import PropTypes from 'prop-types'
import { Excerpt } from './Excerpt'

export const ExcerptList = (props) => (
    <div>
        {
            props.posts.map((item, idx) => (
                <Excerpt
                    key={idx}
                    {...item}
                />
            ))
        }
    </div>
)

ExcerptList.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        modified: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        excerpt: PropTypes.string.isRequired,
        category: PropTypes.arrayOf(PropTypes.shape({
            term_id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            slug: PropTypes.string.isRequired,
        })).isRequired,
        post_tag: PropTypes.array.isRequired,
        post_format: PropTypes.array.isRequired,
    })).isRequired,
}
