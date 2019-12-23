import React from 'react'
import { seo } from '../../site.config'
const Footer = () => (
    <div>
        <span>&copy; {new Date().getFullYear()}</span>
        <span className="siteName">{seo.siteMainTitle}</span>
        {
            !!seo.beian && (
                <a href="http://www.beian.miit.gov.cn/" className="beian" target="_blank" rel="nofollow noopener noreferrer">{seo.beian}</a>
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

export default Footer
