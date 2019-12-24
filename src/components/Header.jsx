import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Head from 'next/head'
import { seo } from '../../site.config'

const headCommentForCompatibility = `
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
        <script src="//cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
        <script src="//cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
`

const Header = (props) => (
    <div className="container-fluid">
        <Head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="author" content={seo.author} />
            <meta name="keywords" content={props.keywords.join(',')} />
            <meta name="description" content={props.description} />
            <link rel="icon" href="/favicon.ico" />
            <title>{props.hideSiteMainTitle ? props.pageTitle : `${props.pageTitle} ${seo.separator} ${seo.siteMainTitle}`}</title>

            <link href="//cdn.bootcss.com/twitter-bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet" />
            <link href="//cdn.bootcss.com/layer/2.3/skin/layer.css" rel="stylesheet" />
            {
                !!seo.baiduStatistics && (
                    <script>{seo.baiduStatistics}</script>
                )
            }
        </Head>
        <div dangerouslySetInnerHTML={{ __html: headCommentForCompatibility }} />
        <nav className="row">
            <div className="col-xs-12 text-left">
                <Link href="/">
                    <a className="menuLink">首页</a>
                </Link>
                <Link href="/about">
                    <a className="menuLink">关于</a>
                </Link>
            </div>
        </nav>

        <style jsx>{`
            .menuLink {
                margin-right: 15px;
                text-decoration: none;
                color: inherit;
            }
            .menuLink:visited {
                text-decoration: underline;
            }
        `}</style>
    </div>
)

Header.propTypes = {
    hideSiteMainTitle: PropTypes.bool,
    pageTitle: PropTypes.string.isRequired,
    keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
}

export default Header