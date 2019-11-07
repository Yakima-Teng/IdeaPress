import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import Link from 'next/link'
import { seo } from '../../../site.config'

const headCommentForCompatibility = `
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
        <script src="//cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
        <script src="//cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
`

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
                    <meta charSet="utf-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta name="author" content={seo.author} />
                    <meta name="keywords" content={props.keywords.join(',')} />
                    <meta name="description" content={props.description} />
                    <link rel="icon" href="/favicon.ico" />
                    <title>{props.hideSiteMainTitle ? props.pageTitle : `${props.pageTitle} - ${seo.siteMainTitle}`}</title>

                    <link href="//cdn.bootcss.com/twitter-bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet" />
                    <link href="//cdn.bootcss.com/layer/2.3/skin/layer.css" rel="stylesheet" />
                </Head>
                <div dangerouslySetInnerHTML={{ __html: headCommentForCompatibility }} />
                <div className="siteMain">
                    <div className="blog-masthead">
                        <div className="container">
                            <nav className="blog-nav">
                                <Link href="/frontend/index">
                                    <a className="blog-nav-item active">首页</a>
                                </Link>
                                <Link href="/frontend/[pageName]" as="/frontend/about">
                                    <a className="blog-nav-item">关于</a>
                                </Link>
                            </nav>
                        </div>
                    </div>

                    <div className="container">

                        <div className="blog-header">
                            <h1 className="blog-title">The Bootstrap Blog</h1>
                            <p className="lead blog-description">The official example template of creating a blog with
                                Bootstrap.</p>
                        </div>

                        <div className="row">

                            <div className="col-sm-8 blog-main">{props.children}</div>

                            <div className="col-sm-3 col-sm-offset-1 blog-sidebar">
                                <div className="sidebar-module sidebar-module-inset">
                                    <h4>About</h4>
                                    <p>Etiam porta <em>sem malesuada magna</em> mollis euismod. Cras mattis consectetur
                                        purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.</p>
                                </div>
                                <div className="sidebar-module">
                                    <h4>Archives</h4>
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
                                <div className="sidebar-module">
                                    <h4>Elsewhere</h4>
                                    <ol className="list-unstyled">
                                        <li><a href="#">GitHub</a></li>
                                        <li><a href="#">Twitter</a></li>
                                        <li><a href="#">Facebook</a></li>
                                    </ol>
                                </div>
                            </div>

                        </div>

                    </div>

                    <footer className="blog-footer">
                        <p>Blog template built for <a href="http://getbootstrap.com">Bootstrap</a> by <a
                            href="https://twitter.com/mdo">@mdo</a>.</p>
                        <p>
                            <a href="#">Back to top</a>
                        </p>
                    </footer>
                </div>
                <script src="//cdn.bootcss.com/jquery/1.12.4/jquery.min.js" />
                <script src="//cdn.bootcss.com/layer/2.3/layer.js" />
                <script src="//cdn.bootcss.com/twitter-bootstrap/3.4.1/js/bootstrap.min.js" />
                <style jsx>{`
                    .siteContainer {
                        display: block;
                        margin: 0 auto;
                        width: auto;
                    }
                    .siteMain {
                        display: block;
                        margin: 0 auto;
                        box-sizing: border-box;
                        padding: 0 6px;
                    }
                    .blog-masthead {
                        background-color: #428bca;
                        box-shadow: inset 0 -2px 5px rgba(0,0,0,.1);
                    }

                    .blog-nav-item {
                        position: relative;
                        display: inline-block;
                        padding: 10px;
                        font-weight: 500;
                        color: #cdddeb;
                    }
                    .blog-nav-item:hover,
                    .blog-nav-item:focus {
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

                    .blog-header {
                        padding-top: 20px;
                        padding-bottom: 20px;
                    }
                    .blog-title {
                        margin-top: 30px;
                        margin-bottom: 0;
                        font-size: 60px;
                        font-weight: normal;
                    }
                    .blog-description {
                        font-size: 20px;
                        color: #999;
                    }

                    .blog-main {
                        font-size: 18px;
                        line-height: 1.5;
                    }

                    .sidebar-module {
                        padding: 15px;
                        margin: 0 -15px 15px;
                    }
                    .sidebar-module-inset {
                        padding: 15px;
                        background-color: #f5f5f5;
                        border-radius: 4px;
                    }
                    .sidebar-module-inset p:last-child,
                    .sidebar-module-inset ul:last-child,
                    .sidebar-module-inset ol:last-child {
                        margin-bottom: 0;
                    }

                    .blog-footer {
                        padding: 40px 0;
                        color: #999;
                        text-align: center;
                        background-color: #f9f9f9;
                        border-top: 1px solid #e5e5e5;
                    }
                    .blog-footer p:last-child {
                        margin-bottom: 0;
                    }
                `}</style>
                <style jsx global>{`
                    body {
                        color: #555555;
                        font-family: "宋体", "Microsoft YaHei", "Helvetica Neue", SimSun, Georgia, "Times New Roman", Times, serif;
                    }


                    @-ms-viewport { width: device-width; }
                    @-o-viewport { width: device-width; }
                    @viewport { width: device-width; }

                    h1, .h1,
                    h2, .h2,
                    h3, .h3,
                    h4, .h4,
                    h5, .h5,
                    h6, .h6 {
                        margin-top: 0;
                        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                        font-weight: normal;
                        color: #333;
                    }

                    @media (min-width: 1200px) {
                        .container {
                            width: 970px;
                        }
                    }
                `}</style>
            </div>
        )
    }
}
