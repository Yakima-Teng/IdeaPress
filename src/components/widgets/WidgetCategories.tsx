import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

export const WidgetCategories = (props) => (
    <div className="row sidebarWidget">
        <h4>分类目录</h4>
        <ol className="list-unstyled">
            {
                props.categoryList.filter((item) => {
                    const sumOfChildsCount = (item.childs || []).reduce((preVal, curVal) => (preVal + curVal.count), 0)
                    item.sumOfChildsCount = sumOfChildsCount
                    return item.count + item.sumOfChildsCount > 0
                }).map((item, idx) => (
                    <li key={idx}>
                        <header className="liHeader">
                            <Link href={`/category/${item.slug}`}>
                                <a>{item.name} ({item.count}{item.sumOfChildsCount > 0 ? `+${item.sumOfChildsCount}` : ''})</a>
                            </Link>
                        </header>
                        {
                            item.childs && item.childs.length > 0 && (
                                <ul>
                                    {
                                        item.childs.filter((d) => d.count > 0).map((d, dIdx) => (
                                            <li key={dIdx}>
                                                <header className="liHeader">
                                                    <Link href={`/category/${item.slug}/${d.slug}`}>
                                                        <a>{d.name} ({d.count})</a>
                                                    </Link>
                                                </header>
                                            </li>
                                        ))
                                    }
                                </ul>
                            )
                        }
                    </li>
                ))
            }
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
