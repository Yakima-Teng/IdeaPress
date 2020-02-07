import React from 'react'
import PropTypes from 'prop-types'
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

        if (currentPage + 4 < totalPages) {
            return [1, currentPage - 3, currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, currentPage + 3, currentPage + 4, totalPages]
        }

        return [1, totalPages - 8, totalPages - 7, totalPages - 6, totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    })()

    const preventDefault = (e, shouldPrevent) => {
        if (shouldPrevent) {
            e.preventDefault()
        }
    }
    const basePath = props.basePath || ''
    return (
        <nav aria-label="Page navigation" className="text-center">
            <ul className="pagination">
                <li className={currentPage === 1 ? 'disabled' : ''}>
                    <Link href={currentPage > 2 ? `${basePath}/page/${currentPage - 1}` : `${basePath}/`}>
                        <a onClick={(e) => preventDefault(e, currentPage === 1)} aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </Link>
                </li>
                {
                    pageNums.slice(0, 1).map((num, numIdx) => (
                        <li
                            key={`first-${numIdx}`}
                            className={currentPage === num ? 'active' : ''}>
                            <Link href={num > 1 ? `${basePath}/page/${num}` : `${basePath}/`}>
                                <a>{num}</a>
                            </Link>
                        </li>
                    ))
                }
                {
                    pageNums[1] - pageNums[0] !== 1 && (
                        <li
                            key={'ellipsis-before'}
                            className={'disabled'}>
                            <Link href={''}>
                                <a onClick={(e) => preventDefault(e, true)}>...</a>
                            </Link>
                        </li>
                    )
                }
                {
                    pageNums.slice(1, -1).map((num, numIdx) => (
                        <li
                            key={`middle-${numIdx}`}
                            className={currentPage === num ? 'active' : ''}>
                            <Link href={num > 1 ? `${basePath}/page/${num}` : `${basePath}/`}>
                                <a>{num}</a>
                            </Link>
                        </li>
                    ))
                }
                {
                    pageNums.slice(-1)[0] - pageNums.slice(-2, -1)[0] !== 1 && (
                        <li
                            key={'ellipsis-after'}
                            className={'disabled'}>
                            <Link href={''}>
                                <a onClick={(e) => preventDefault(e, true)}>...</a>
                            </Link>
                        </li>
                    )
                }
                {
                    pageNums.slice(-1).map((num, numIdx) => (
                        <li
                            key={`last-${numIdx}`}
                            className={currentPage === num ? 'active' : ''}>
                            <Link href={num > 1 ? `${basePath}/page/${num}` : `${basePath}/`}>
                                <a>{num}</a>
                            </Link>
                        </li>
                    ))
                }
                <li className={currentPage === totalPages ? 'disabled' : ''}>
                    <Link href={currentPage === totalPages ? '' : `${basePath}/page/${currentPage + 1}`}>
                        <a onClick={(e) => preventDefault(e, currentPage === totalPages)} aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

PageNavigation.propTypes = {
    basePath: PropTypes.string.isRequired,
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
}
