import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Link from 'next/link'

export const PageNavigation = (props) => {
    const currentPage = props.currentPage
    const totalPages = props.totalPages
    const pageNums = (() => {
        if (totalPages < 11) {
            const arr = []
            for (let i = 1; i <= totalPages; i++) {
                arr.push(i)
            }
            return arr
        }

        if (currentPage < 5) {
           return [1, 2, 3, 4, 5, 6, 7, 8, 9, totalPages]
        }

        if (currentPage - 3 > 1 && currentPage + 4 < totalPages) {
            return [1, currentPage - 3, currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, currentPage + 3, currentPage + 4, totalPages]
        }

        if (currentPage + 4 < totalPages) {
            return [1, totalPages - 8, totalPages - 7, totalPages - 6, totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        }

        return []
    })()
    return (
        <nav aria-label="Page navigation">
            <ul className="pagination">
                <li className={currentPage === 1 ? 'disabled' : ''}>
                    <Link href={currentPage === 1 ? 'javascript:void(0);' : `/page/${currentPage - 1}`}>
                        <a aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </Link>
                </li>
                {
                    pageNums.map((num, numIdx) => (
                        <li
                            key={numIdx}
                            className={currentPage === num ? 'active' : ''}>
                            <Link href={num > 1 ? `/page/${num}` : '/'}>
                                <a>{num}</a>
                            </Link>
                        </li>
                    ))
                }
                <li className={currentPage === totalPages ? 'disabled' : ''}>
                    <Link href={currentPage === totalPages ? 'javascript:void(0);' : `/page/${currentPage + 1}`}>
                        <a aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

PageNavigation.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onClickPage: PropTypes.func.isRequired,
}
