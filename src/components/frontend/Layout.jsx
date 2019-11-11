import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import Footer from './Footer'

const Layout = (props) => (
    <div className="siteContainer">
        <Header
            pageTitle={props.pageTitle}
            keywords={props.keywords}
            description={props.description}
            hideSiteMainTitle={props.hideSiteMainTitle}
        />
        <div className="siteMain">{props.children}</div>
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
        `}</style>
    </div>
)

Layout.propTypes = {
    hideSiteMainTitle: PropTypes.bool,
    pageTitle: PropTypes.string.isRequired,
    keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
    children: PropTypes.any.isRequired,
    description: PropTypes.string.isRequired,
}

export default Layout
