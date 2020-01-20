import React from 'react'
import PropTypes from 'prop-types'

export const WidgetLinks = (props) => (
    <div className="row sidebarWidget">
        <h4>链接</h4>
        <ol className="list-unstyled clearfix">
            {
                props.links.map((item, idx) => (
                    <li className="link" key={idx}>
                        {
                            idx > 0 && (
                                <span>、</span>
                            )
                        }
                        <a
                            href={item.link_url}
                            title={item.link_description || item.link_name}
                            rel={item.link_rel}
                            target={item.link_target}>{item.link_name}</a>
                    </li>
                ))
            }
        </ol>

        <style jsx>{`
            .link {
                float: left;
            }
        `}</style>
    </div>
)

WidgetLinks.propTypes = {
    links: PropTypes.arrayOf(PropTypes.shape({
        link_id: PropTypes.number.isRequired,
        link_url: PropTypes.string.isRequired,
        link_name: PropTypes.string.isRequired,
        link_image: PropTypes.string.isRequired,
        link_target: PropTypes.string.isRequired,
        link_description: PropTypes.string.isRequired,
        link_visible: PropTypes.string.isRequired,
        link_owner: PropTypes.number.isRequired,
        link_rating: PropTypes.number.isRequired,
        link_updated: PropTypes.string.isRequired,
        link_rel: PropTypes.string.isRequired,
        link_notes: PropTypes.string.isRequired,
        link_rss: PropTypes.string.isRequired,
    })).isRequired,
}
