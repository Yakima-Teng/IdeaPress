import React from 'react'
import PropTypes from 'prop-types'
import { WidgetLinks } from './widgets/WidgetLinks'
import { WidgetRandomPosts } from './widgets/WidgetRandomPosts'
import { WidgetRandomComments } from './widgets/WidgetRandomComments'

const Footer = (props) => (
    <div className="siteFooter">
        <div className="row siteFooterWidgets">
            <div className="col-sm-4">
                {
                    props.links && props.links.length > 0 && (
                        <WidgetRandomComments
                            commentList={props.randomComments.map((item) => ({
                                as: `/${encodeURIComponent(item.post_name)}.html#comment-${item.comment_ID}`,
                                href: `/templates/post?postType=post&postName=${item.post_name}`,
                                title: item.comment_date.replace(/T.+$/, ''),
                                contentPrefix: `${item.comment_author} (${item.comment_date.replace(/T.+$/, '')}): `,
                                contentDetail: item.comment_content,
                            }))}
                        />
                    )
                }
            </div>
            <div className="col-sm-3 col-sm-offset-1">
                {
                    props.links && props.links.length > 0 && (
                        <WidgetRandomPosts
                            postList={props.randomPosts.map((item) => ({
                                as: `/${item.post_name}.html`,
                                href: `/templates/post?postType=post&postName=${item.post_name}`,
                                title: item.post_title,
                                name: item.post_title,
                            }))}
                        />
                    )
                }
            </div>
            <div className="col-sm-3 col-sm-offset-1">
                {
                    props.links && props.links.length > 0 && (
                        <WidgetLinks links={props.links} />
                    )
                }
            </div>
        </div>
        <div className="row siteVeryFooter">
            <span>&copy; {new Date().getFullYear()}</span>
            <span className="siteName">{props.blogName}</span>
            {
                !!props.beianCode && (
                    <a href="http://www.beian.miit.gov.cn/" className="beian" target="_blank" rel="nofollow noopener noreferrer">{props.beianCode}</a>
                )
            }
            <span className="poweredBy">
                Powered by &nbsp;
                <a
                    href="https://github.com/Yakima-Teng/IdeaPress"
                    target="_blank"
                    rel="noopener noreferrer nofollow">IdeaPress</a>
            </span>
        </div>
        <script src="//cdn.bootcss.com/jquery/1.12.4/jquery.min.js" />
        <script src="//cdn.bootcss.com/layer/2.3/layer.js" />
        <script src="//cdn.bootcss.com/twitter-bootstrap/3.4.1/js/bootstrap.min.js" />
        <style jsx>{`
            .siteFooter {
                margin-top: 15px;
            }
            .siteFooterWidgets {
                display: block;
                background-color: #d0d0d0;
                border-top: 2px solid #ededed;
                margin-left: 0;
                margin-right: 0;
                padding: 15px;
            }
            .siteVeryFooter {
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
    randomPosts: PropTypes.array.isRequired,
    randomComments: PropTypes.array.isRequired,
    links: PropTypes.array,
}

export default Footer
