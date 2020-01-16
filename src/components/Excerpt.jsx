import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { trimHtml } from '../scripts/utils'

export class Excerpt extends Component {
    static propTypes = {
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
    }

    elemExcerpt = null

    componentDidMount () {
        this.limitContentToAtMostThreeLines()
        window.addEventListener('resize', this.limitContentToAtMostThreeLines, false)
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.limitContentToAtMostThreeLines, false)
    }

    limitContentToAtMostThreeLines = () => { // 摘要最多显示三行文本
        const elemExcerpt = this.elemExcerpt
        const lineHeight = parseFloat(getComputedStyle(elemExcerpt).lineHeight)
        let showingText = this.props.excerpt
        if (showingText.length > 1000) {
            showingText = showingText.substr(0, 1000) // 如果碰到大量的文本，用下面的方式循环费劲，直接砍到1000长度
        }
        let count = 0
        while (showingText.length > 0 && parseFloat(getComputedStyle(elemExcerpt).height) > lineHeight * 4 - 3) {
            showingText = showingText.substr(0, showingText.length - 4) + '...'
            elemExcerpt.innerText = showingText
            count++
            if (count > 1000) {
                break // 避免死循环
            }
        }
    }

    render () {
        const props = this.props
        return (
            <div className="row post">
                <header className="row">
                    <h2 className="col-xs-12 h4">
                        <Link href={`/${props.slug}.html`}>
                            <a>{props.title}</a>
                        </Link>
                    </h2>
                </header>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="label label-default">
                            <span className="glyphicon glyphicon-calendar" />
                            &nbsp;
                            {(props.modified || props.date).replace(/T.*$/, '')}
                        </div>

                        {
                            props.category.length > 0 && (
                                <div className="label label-default ml1em">
                                    <span className="glyphicon glyphicon-list-alt" />
                                    &nbsp;
                                    {props.category.map((cat) => cat.name).join(', ')}
                                </div>
                            )
                        }

                        {
                            props.post_tag.length > 0 && (
                                <div className="label label-default ml1em">
                                    <span className="glyphicon glyphicon-tags" />
                                    &nbsp;
                                    {props.post_tag.map((tag) => tag.name).join(', ')}
                                </div>
                            )
                        }
                    </div>
                </div>
                <article
                    ref={(elem) => (this.elemExcerpt = elem)}
                    className="postExcerpt" dangerouslySetInnerHTML={{ __html: trimHtml(props.excerpt).html }} />

                <style jsx>{`
                    .post {
                        display: block;
                        padding-top: 10px;
                        padding-bottom: 10px;
                    }
                    .post:nth-of-type(n+2) {
                        border-top: 1px dashed #7797a2;
                        margin-top: 10px;
                    }
                    .postExcerpt {
                        display: block;
                        margin-top: 0.5em;
                        word-break: break-word;
                    }
                    .ml1em {
                        margin-left: 1em;
                    }
                `}</style>
                <style jsx global>{`
                    .crayon-plain-wrap {
                        display: none;
                    }
                    p:nth-last-of-type(1) {
                        margin-bottom: 0;
                    }
                `}</style>
            </div>
        )
    }
}
