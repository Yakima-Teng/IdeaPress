import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import Link from 'next/link'
import {
    goPage,
    refreshPage,
} from '../scripts/utils'

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

    const jumpPage = (e, targetPageNum) => {
        e.preventDefault()
        if (targetPageNum === null || targetPageNum < 1 || targetPageNum > totalPages) {
            return
        }
        if (currentPage === targetPageNum) {
            refreshPage({})
            return
        }
        goPage({
            pathname: targetPageNum !== 1 ? `/page/${targetPageNum}` : '/',
            query: {},
        })
    }

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination">
                <li className={currentPage === 1 ? 'disabled' : ''}>
                    <a onClick={(e) => jumpPage(e, currentPage - 1)} href="" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                {
                    pageNums.slice(0, 1).map((num, numIdx) => (
                        <li
                            key={`first-${numIdx}`}
                            className={currentPage === num ? 'active' : ''}>
                            <a onClick={(e) => jumpPage(e, num)} href="">{num}</a>
                        </li>
                    ))
                }
                {
                    pageNums[1] - pageNums[0] !== 1 && (
                        <li
                            key={'ellipsis-before'}
                            className={'disabled'}>
                            <a onClick={(e) => jumpPage(e, null)} href="">...</a>
                        </li>
                    )
                }
                {
                    pageNums.slice(1, -1).map((num, numIdx) => (
                        <li
                            key={`middle-${numIdx}`}
                            className={currentPage === num ? 'active' : ''}>
                            <a onClick={(e) => jumpPage(e, num)} href="">{num}</a>
                        </li>
                    ))
                }
                {
                    pageNums.slice(-1)[0] - pageNums.slice(-2, -1)[0] !== 1 && (
                        <li
                            key={'ellipsis-after'}
                            className={'disabled'}>
                            <a onClick={(e) => jumpPage(e, null)} href="">...</a>
                        </li>
                    )
                }
                {
                    pageNums.slice(-1).map((num, numIdx) => (
                        <li
                            key={`last-${numIdx}`}
                            className={currentPage === num ? 'active' : ''}>
                            <a onClick={(e) => jumpPage(e, num)} href="">{num}</a>
                        </li>
                    ))
                }
                <li className={currentPage === totalPages ? 'disabled' : ''}>
                    <a onClick={(e) => jumpPage(e, currentPage + 1)} href="" aria-label="Previous">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    )
}

PageNavigation.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
}
