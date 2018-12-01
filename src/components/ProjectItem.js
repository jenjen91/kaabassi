import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import PreviewCompatibleImage from './PreviewCompatibleImage'

export const ProjectItem = ({ post }) => {

  return (
    <div className="card project-item" key={post.id}>
      <div className="card-image">
         <PreviewCompatibleImage imageInfo={post.frontmatter.thumbnail} />
      </div>
      <div className="card-content">
        <div className="media">
          <div className="media-content">
            <Link className="title is-4" to={post.fields.slug}>
              {post.frontmatter.title}
            </Link>
          </div>
        </div>
        <div className="content">
          <p>{post.excerpt}</p>
        </div>
      </div>
      <footer className="card-footer">
        <Link className="card-footer-item" to={post.fields.slug}>
          Lees meer →
        </Link>
      </footer>
    </div>
  )
}

ProjectItem.propTypes = {
  post: PropTypes.object.isRequired
}
