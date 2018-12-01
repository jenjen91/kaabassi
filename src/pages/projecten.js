import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'
import PreviewCompatibleImage from '../components/PreviewCompatibleImage'

export default class ProjectenPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <Layout>
        <section className="section">
          <div className="container">
            <div className="content">
              <h1 className="has-text-weight-bold is-size-2">Projecten</h1>
            </div>
            {posts
              .map(({ node: post }) => (
                <div class="card" key={post.id}>
                  <div class="card-image">
                     <PreviewCompatibleImage imageInfo={post.frontmatter.thumbnail} />
                  </div>
                  <div class="card-content">
                    <div class="media">
                      <div class="media-content">
                        <Link className="title is-4" to={post.fields.slug}>
                          {post.frontmatter.title}
                        </Link>
                      </div>
                    </div>
                    <div class="content">
                      <p>{post.excerpt}</p>
                      <br />
                      <time datetime="2016-1-1">{post.frontmatter.date}</time>
                    </div>
                    <footer class="card-footer">
                      <Link className="button is-small" to={post.fields.slug}>
                        Keep Reading →
                      </Link>
                      <a href="www.facebook.com" class="card-footer-item">Share</a>
                    </footer>
                  </div>
                </div>
              ))}
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
    }
  }
`
