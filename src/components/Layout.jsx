import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import Footer from './Footer'

const Layout = (props) => (
    <div className="container siteContainer">
        <Header
            pageTitle={props.pageTitle}
            keywords={props.keywords}
            description={props.description}
            hideSiteMainTitle={props.hideSiteMainTitle}
        />
        <div className="container-fluid siteMain">
            <div className="row">
                <div className="col-sm-8">{props.children}</div>
                <div className="col-sm-3 col-sm-offset-1 blog-sidebar">
                    <div className="sidebar-module sidebar-module-inset">
                        <h4>About</h4>
                        <p>Etiam porta <em>sem malesuada magna</em> mollis euismod. Cras mattis consectetur purus sit amet
                            fermentum. Aenean lacinia bibendum nulla sed consectetur.</p>
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
        <Footer />
        <style jsx global>{`
            body {
                padding: 20px;
                line-height: 1.8;
                background-color: #7798a3;
                font-size: 14px;
                color: #464646;
                font-family: "宋体", "Microsoft YaHei", "Helvetica Neue", SimSun;
            }
            .siteContainer {
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                max-width: 960px;
                background-color: #e4eaed;
                border-radius: 8px;
            }
            .siteMain {
                display: block;
                margin-top: 10px;
            }

            .ml1em { margin-left: 1em; }
        `}</style>
    </div>
)

Layout.propTypes = {
    hideSiteMainTitle: PropTypes.bool,
    pageTitle: PropTypes.string.isRequired,
    keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
    children: PropTypes.any.isRequired,
    description: PropTypes.string.isRequired,
    categoryList: PropTypes.array,
}

export default Layout
