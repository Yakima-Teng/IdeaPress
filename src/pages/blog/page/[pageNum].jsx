import React, { Component } from 'react'
import Layout from '../../../components/frontend/Layout'
import { seo } from '../../../../site.config'

export default class Index extends Component {
    render () {
        return (
            <Layout
                hideSiteMainTitle={true}
                pageTitle={`${seo.siteMainTitle} - ${seo.siteSubTitle}`}
                keywords={seo.keywords}
                description={seo.description}>
                <div className="blog-post">
                    <h2 className="blog-post-title">Sample blog post</h2>
                    <p className="blog-post-meta">January 1, 2014 by <a href="#">Mark</a></p>

                    <p>{`This blog post shows a few different types of content that's supported and styled
                        with Bootstrap. Basic typography, images, and code are all supported.`}</p>
                    <hr />
                    <p>Cum sociis natoque penatibus et magnis <a href="#">dis parturient montes</a>,
                        nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam
                        venenatis vestibulum. Sed posuere consectetur est at lobortis. Cras mattis
                        consectetur purus sit amet fermentum.</p>
                    <blockquote>
                        <p>Curabitur blandit tempus porttitor. <strong>Nullam quis risus eget urna
                            mollis</strong> ornare vel eu leo. Nullam id dolor id nibh ultricies
                            vehicula ut id elit.</p>
                    </blockquote>
                    <p>Etiam porta <em>sem malesuada magna</em> mollis euismod. Cras mattis consectetur
                        purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.</p>
                    <h2>Heading</h2>
                    <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis
                        mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio
                        sem nec elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
                    <h3>Sub-heading</h3>
                    <p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus
                        mus.</p>
                    <pre><code>Example code block</code></pre>
                    <p>Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna
                        mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris
                        condimentum nibh, ut fermentum massa.</p>
                    <h3>Sub-heading</h3>
                    <p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus
                        mus. Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada
                        magna mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris
                        condimentum nibh, ut fermentum massa justo sit amet risus.</p>
                    <ul>
                        <li>Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</li>
                        <li>Donec id elit non mi porta gravida at eget metus.</li>
                        <li>Nulla vitae elit libero, a pharetra augue.</li>
                    </ul>
                    <p>Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae elit libero, a
                        pharetra augue.</p>
                    <ol>
                        <li>Vestibulum id ligula porta felis euismod semper.</li>
                        <li>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
                            ridiculus mus.
                        </li>
                        <li>Maecenas sed diam eget risus varius blandit sit amet non magna.</li>
                    </ol>
                    <p>Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at
                        lobortis.</p>
                </div>

                <div className="blog-post">
                    <h2 className="blog-post-title">Another blog post</h2>
                    <p className="blog-post-meta">December 23, 2013 by <a href="#">Jacob</a></p>

                    <p>Cum sociis natoque penatibus et magnis <a href="#">dis parturient montes</a>,
                        nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam
                        venenatis vestibulum. Sed posuere consectetur est at lobortis. Cras mattis
                        consectetur purus sit amet fermentum.</p>
                    <blockquote>
                        <p>Curabitur blandit tempus porttitor. <strong>Nullam quis risus eget urna
                            mollis</strong> ornare vel eu leo. Nullam id dolor id nibh ultricies vehicula ut
                            id elit.</p>
                    </blockquote>
                    <p>Etiam porta <em>sem malesuada magna</em> mollis euismod. Cras mattis consectetur
                        purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.</p>
                    <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis,
                        est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
                        Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
                </div>

                <div className="blog-post">
                    <h2 className="blog-post-title">New feature</h2>
                    <p className="blog-post-meta">December 14, 2013 by <a href="#">Chris</a></p>

                    <p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                        Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna
                        mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum
                        nibh, ut fermentum massa justo sit amet risus.</p>
                    <ul>
                        <li>Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</li>
                        <li>Donec id elit non mi porta gravida at eget metus.</li>
                        <li>Nulla vitae elit libero, a pharetra augue.</li>
                    </ul>
                    <p>Etiam porta <em>sem malesuada magna</em> mollis euismod. Cras mattis consectetur
                        purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.</p>
                    <p>Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae elit libero, a
                        pharetra augue.</p>
                </div>

                <nav>
                    <ul className="pager">
                        <li><a href="#">Previous</a></li>
                        <li><a href="#">Next</a></li>
                    </ul>
                </nav>

                <style jsx>{`
                    .pager {
                        margin-bottom: 60px;
                        text-align: left;
                    }
                    .pager > li > a {
                        width: 140px;
                        padding: 10px 20px;
                        text-align: center;
                        border-radius: 30px;
                    }

                    .blog-post {
                        margin-bottom: 60px;
                    }
                    .blog-post-title {
                        margin-bottom: 5px;
                        font-size: 40px;
                    }
                    .blog-post-meta {
                        margin-bottom: 20px;
                        color: #999;
                    }
                `}</style>
            </Layout>
        )
    }
}
