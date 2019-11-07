import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { seo } from '../../../site.config'

export default class Layout extends Component {
    static propTypes = {
        hideSiteMainTitle: PropTypes.bool,
        pageTitle: PropTypes.string.isRequired,
        keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
        description: PropTypes.string.isRequired,
        children: PropTypes.any.isRequired,
    }

    componentDidMount () {}

    render () {
        const props = this.props
        return (
            <div className="siteContainer">
                <Head>
                    <title>{props.hideSiteMainTitle ? props.pageTitle : `${props.pageTitle} - ${seo.siteMainTitle}`}</title>
                    <meta name="keywords" content={props.keywords.join(',')} />
                    <meta name="description" content={props.description} />
                    <meta name='viewport' content='initial-scale=1.0, width=device-width' />
                    <link href="//cdn.bootcss.com/layer/2.3/skin/layer.css" rel="stylesheet" />
                </Head>
                <div className="siteMain">{props.children}</div>
                <script src="//cdn.bootcss.com/jquery/3.4.1/jquery.min.js" />
                <script src="//cdn.bootcss.com/layer/2.3/layer.js" />
                <style jsx global>{`
                    * {
                        padding: 0;
                        margin: 0;
                        border: none;
                        appearance: none;
                    }
                    body {
                        line-height: 1.8;
                        background-color: #eef0ed;
                        font-size: 14px;
                        color: #666666;
                        font-family: "宋体", "Microsoft YaHei", "Helvetica Neue", SimSun;
                        margin: 0;
                    }
                    .siteContainer {
                        display: block;
                        margin: 0 auto;
                        width: auto;
                    }
                    .siteMain {
                        display: block;
                        width: 1200px;
                        margin: 0 auto;
                        box-sizing: border-box;
                        padding: 0 6px;
                    }
                `}</style>
            </div>
        )
    }
}
