import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import PreviewCompatibleImage from '../components/PreviewCompatibleImage'

export const AgendaPageTemplate = ({
  title,
  subtitle,
  image,
  content,
  contentComponent
}) => {
  const PageContent = contentComponent || Content

  return (
    <div>
      <section className="hero is-info" style={{backgroundColor: '#277700'}}>
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              <h1 className="has-text-weight-bold is-size-2">{title}</h1>
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
            <div className="column is-half">
              <PreviewCompatibleImage imageInfo={image} />
            </div>
            <div className="column">
              <PageContent className="content" content={content} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

AgendaPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
}

const AgendaPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark
  const { markdownRemark: post } = data

  return (
    <Layout>
      <AgendaPageTemplate
        image={frontmatter.image}
        content={post.html}
        contentComponent={HTMLContent}
        title={frontmatter.title}
        subtitle={frontmatter.subtitle}
      />
    </Layout>
  )
}

AgendaPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default AgendaPage

export const agendaPageQuery = graphql`
  query AgendaPage($id: String!) {
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
