import React, { Component } from 'react'
import Layout from '../../components/frontend/Layout'
import { seo } from '../../../site.config'

export default class Index extends Component {
    render () {
        return (
            <Layout
                hideSiteMainTitle={true}
                pageTitle={`${seo.siteMainTitle} - ${seo.siteSubTitle}`}
                keywords={seo.keywords}
                description={seo.description}>
                FrontEnd HomePage
            </Layout>
        )
    }
}
