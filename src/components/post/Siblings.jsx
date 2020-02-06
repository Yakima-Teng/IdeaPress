/**
 * 上一篇文章和下一篇文章，用于文章详情页
 */

import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { hasValue } from '../../scripts/utils'

export const Siblings = (props) => (
    <div className="siblings clearfix">
        {
            hasValue(props.nextText) && (
                <div className="pull-left">
                    <Link href={props.nextLink}>
                        <a className="link">← {props.nextText}</a>
                    </Link>
                </div>
            )
        }

        {
            hasValue(props.prevText) && (
                <div className="pull-right">
                    <Link href={props.prevLink}>
                        <a className="link">{props.prevText} →</a>
                    </Link>
                </div>
            )
        }
    </div>
)

Siblings.propTypes = {
    nextText: PropTypes.string.isRequired, // 下一篇文章的标题
    nextLink: PropTypes.string.isRequired, // 下一篇文章的链接
    prevText: PropTypes.string.isRequired, // 上一篇文章的标题
    prevLink: PropTypes.string.isRequired, // 上一篇文章的链接
}
