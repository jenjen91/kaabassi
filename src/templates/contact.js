import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import ContactForm from '../pages/contact/ContactForm'
import Content, { HTMLContent } from '../components/Content'
import Layout from '../components/Layout'

export const ContactTemplate = ({ address, phone, email, facebook, content, contentComponent }) => {
  const PageContent = contentComponent || Content

  return (
    <div>
    <section className="hero is-primary" style={{backgroundColor: '#277700'}}>
      <div className="hero-body">
        <div className="container">
          <h1 className="title">Contact</h1>
        </div>
      </div>
    </section>
      <section className="section section--gradient">
        <div className="container">
          <PageContent className="content" content={content} />
          <div className="section">
            <p><b>Address:</b> {address}</p>
            <p><b>Tel:</b> {phone}</p>
            <p><b>Email:</b> <a href={`mailto:${email}`}>{email}</a></p>
            <p><b>Facebook:</b> <a href={facebook}>{facebook}</a></p>
          </div>
          <div className="section">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}

ContactTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  content: PropTypes.string,
  contentComponent: PropTypes.func,
}

const Contact = ({ data }) => {
  const { markdownRemark: post } = data

  return (
    <Layout>
      <ContactTemplate
        contentComponent={HTMLContent}
        address={post.frontmatter.address}
        phone={post.frontmatter.phone}
        email={post.frontmatter.email}
        facebook={post.frontmatter.facebook}
        content={post.html}
      />
    </Layout>
  )
}

Contact.propTypes = {
  data: PropTypes.object.isRequired,
}

export default Contact

export const ContactQuery = graphql`
  query Contact($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        address
        phone
        email
        facebook
      }
    }
  }
`
