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
        <div className="row">
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

            <div className="siteHeader">
                <div className="siteHeaderTop">
                    <h1>
                        <Link href="/">
                            <a>{props.blogName}</a>
                        </Link>
                    </h1>
                    <p className="lead">{props.blogDescription}</p>
                </div>
                <Link href="/">
                    <a className="bannerWrapper">
                        <img src="/forest.png" alt="" className="imgBanner" />
                    </a>
                </Link>
            </div>

            <div className="siteNav">
                <div className="container">
                    <nav className="blog-nav">
                        <Link href="/">
                            <a className="blog-nav-item active">首页</a>
                        </Link>
                        <Link href="/about">
                            <a className="blog-nav-item">关于</a>
                        </Link>
                    </nav>
                </div>
            </div>
        </div>

        <style jsx>{`
            .siteHeaderTop {
                position: relative;
                padding: 15px 0;
            }
            .siteHeaderTop h1 {
                margin: 0 auto;
            }
            .siteHeaderTop .lead {
                position: absolute;
                top: 50%;
                right: 0;
                transform: translate(0, -50%);
            }
            .bannerWrapper {
                display: block;
            }
            .bannerWrapper .imgBanner {
                display: block;
                width: 100%;
                height: auto;
            }
            .siteNav {
                margin-top: 0px;
                background-color: #7798a3;
                -webkit-box-shadow: inset 0 -2px 5px rgba(0, 0, 0, .1);
                box-shadow: inset 0 -2px 5px rgba(0, 0, 0, .1);
            }
            .blog-nav-item {
                position: relative;
                display: inline-block;
                padding: 10px;
                font-weight: 500;
                color: #cdddeb;
            }
            .blog-nav-item:hover, .blog-nav-item:focus {
                color: #fff;
                text-decoration: none;
            }
            .blog-nav .active {
                color: #fff;
            }
            .blog-nav .active:after {
                position: absolute;
                bottom: 0;
                left: 50%;
                width: 0;
                height: 0;
                margin-left: -5px;
                vertical-align: middle;
                content: " ";
                border-right: 5px solid transparent;
                border-bottom: 5px solid;
                border-left: 5px solid transparent;
            }
        `}</style>
    </div>
)

Header.propTypes = {
    blogName: PropTypes.string.isRequired,
    blogDescription: PropTypes.string.isRequired,
    hideSiteMainTitle: PropTypes.bool,
    pageTitle: PropTypes.string.isRequired,
    keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
}

export default Header
