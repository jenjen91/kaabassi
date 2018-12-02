import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import {ProjectItem} from '../components/ProjectItem'

export default class ProjectenPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <Layout>
        <section className="hero is-info" style={{backgroundColor: '#277700'}}>
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Projecten</h1>
              <h2 className="subtitle">
                Al onze projecten in Den Haag
              </h2>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="columns project-container">
            {posts
              .map(({ node: post }) => (<ProjectItem post={post} key={post.id} />)
            )}
          </div>
        </section>
      </Layout>
    )
  }
}

ProjectenPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export const pageQuery = graphql`
  query ProjectenQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] },
      filter: { frontmatter: { templateKey: { eq: "blog-post" } }}
    ) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
            thumbnail {
              childImageSharp {
                fluid(maxWidth: 2048, quality: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
