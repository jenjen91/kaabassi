import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import PreviewCompatibleImage from '../components/PreviewCompatibleImage'

export const AboutPageTemplate = ({ title, subtitle, image, content, contentComponent }) => {
  const PageContent = contentComponent || Content

  return (
    <div>
    <section className="hero is-primary" style={{backgroundColor: '#277700'}}>
      <div className="hero-body">
        <div className="container">
          <h1 className="title">
          {title}
          </h1>
          <h2 className="subtitle">
            {subtitle}
          </h2>
        </div>
      </div>
    </section>
      <section className="section section--gradient">
        <div className="container">
          <div className="columns">
            <div className="column">
              <div className="section">
                <PageContent className="content" content={content} />
              </div>
            </div>
            <div className="column is-half">
              <PreviewCompatibleImage imageInfo={image} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

AboutPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  content: PropTypes.string,
  contentComponent: PropTypes.func,
}

const AboutPage = ({ data }) => {
  const { markdownRemark: post } = data

  return (
    <Layout>
      <AboutPageTemplate
        contentComponent={HTMLContent}
        title={post.frontmatter.title}
        subtitle={post.frontmatter.subtitle}
        image={post.frontmatter.image}
        content={post.html}
      />
    </Layout>
  )
}

AboutPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default AboutPage

export const aboutPageQuery = graphql`
  query AboutPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        subtitle
        image {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
