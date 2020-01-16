import React from 'react'
import PropTypes from 'prop-types'

const Footer = (props) => (
    <div>
        <span>&copy; {new Date().getFullYear()}</span>
        <span className="siteName">{props.blogName}</span>
        {
            !!props.beianCode && (
                <a href="http://www.beian.miit.gov.cn/" className="beian" target="_blank" rel="nofollow noopener noreferrer">{props.beianCode}</a>
            )
        }
        <span className="poweredBy">Powered by <a href="http://www.orzzone.com" target="_blank" rel="noopener noreferrer">IdeaPress</a></span>
        <script src="//cdn.bootcss.com/jquery/1.12.4/jquery.min.js" />
        <script src="//cdn.bootcss.com/layer/2.3/layer.js" />
        <script src="//cdn.bootcss.com/twitter-bootstrap/3.4.1/js/bootstrap.min.js" />
        <style jsx>{`
            div {
                text-align: center;
                font-size: 12px;
                color: #999;
                margin-top: 20px;
            }
            .siteName {
                margin-left: 6px;
                margin-right: 6px;
            }
            .beian {
                text-decoration: underline;
                color: inherit;
            }
            .poweredBy {
                display: inline;
                margin-left: 6px;
            }
        `}</style>
    </div>
)

Footer.propTypes = {
    blogName: PropTypes.string.isRequired,
    beianCode: PropTypes.string.isRequired,
}

export default Footer
