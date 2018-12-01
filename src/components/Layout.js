import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from "gatsby"

import Navbar from '../components/Navbar'
import './all.sass'

const TemplateWrapper = ({ children }) => (
  <StaticQuery
    query={graphql`
      query HeadingQuery {
          site {
            siteMetadata {
              title,
              description,
            }
          }
        }
    `}
    render={data => (
      <div>
        <Helmet>
          <html lang="en" />
          <title>{data.site.siteMetadata.title}</title>
          <meta name="description" content={data.site.siteMetadata.description} />
        </Helmet>
        <Navbar />
        <div>{children}</div>
        <footer className="footer">
          <div className="content has-text-centered">
            <p>
              <strong>Stichting Kaabassi</strong>
            </p>
          </div>
      </footer>
      </div>
    )}
  />
)

export default TemplateWrapper
