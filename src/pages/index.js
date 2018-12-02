import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'
import {ProjectItem} from '../components/ProjectItem'

export default class IndexPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark
    console.dir(posts)

    return (
      <Layout>
        <section className="section">
          <div className="container">
            <div className="content">
              <h1 className="front-header"><Link to="/about">Over ons</Link></h1>
              <section className="section">
                <p>Kaabassi is een non- profit organisatie die zich
                bezighoudt met het ondersteunen van mensen die zich op de één of andere manier buitengeslotenvoelen.</p>
              </section>
              <h1 className="front-header"><Link to="/projecten">Projecten</Link></h1>
              <center>Al onze projecten in Den Haag</center>
            </div>
            <section className="section">
              <div className="columns project-container">
                {posts
                  .map(({ node: post }) => (<ProjectItem post={post} key={post.id} />)
                )}
              </div>
            </section>
          </div>
        </section>
      </Layout>
    )
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export const pageQuery = graphql`
  query IndexQuery {
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
