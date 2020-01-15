import React from 'react'
import PropTypes from 'prop-types'

export const WidgetCategories = (props) => (
    <div className="row sidebarWidget">
        <h4>Categories</h4>
        <ol className="list-unstyled">
            <li><a href="#">March 2014</a></li>
            <li><a href="#">February 2014</a></li>
            <li><a href="#">January 2014</a></li>
            <li><a href="#">December 2013</a></li>
            <li><a href="#">November 2013</a></li>
            <li><a href="#">October 2013</a></li>
            <li><a href="#">September 2013</a></li>
            <li><a href="#">August 2013</a></li>
            <li><a href="#">July 2013</a></li>
            <li><a href="#">June 2013</a></li>
            <li><a href="#">May 2013</a></li>
            <li><a href="#">April 2013</a></li>
        </ol>
    </div>
)

const PropTypesForCategoryItem = PropTypes.shape({
    term_id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    term_taxonomy_id: PropTypes.number.isRequired,
    taxonomy: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    parent: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    childs: PropTypes.array.isRequired,
})
WidgetCategories.propTypes = {
    categoryList: PropTypes.arrayOf(PropTypesForCategoryItem).isRequired,
}
