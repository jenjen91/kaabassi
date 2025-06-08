// components/ProjectItem.js
'use client'; // Keep this line if it's a Client Component

import React from 'react'; // Not strictly needed if only using JSX but good practice
import PropTypes from 'prop-types'; // Keep if you use PropTypes
import Link from 'next/link'; // Next.js Link
import PreviewCompatibleImage from './PreviewCompatibleImage'; // Your updated component

// Change from `export const ProjectItem` to `const ProjectItem` and then `export default ProjectItem`
const ProjectItem = ({ post }) => {
  // Your existing JSX for ProjectItem
  console.dir(post)
  return (
    <div className="column is-one-third">
      <div className="card" key={post.id}>
        <div className="card-image">
          <PreviewCompatibleImage imageInfo={post.frontmatter.thumbnail} />
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-content">
              <Link className="title is-4" href={post.fields.slug}>
                {post.frontmatter.title}
              </Link>
            </div>
          </div>
          <div className="content">
            <p>{post.frontmatter.description}</p>
          </div>
        </div>
        <footer className="card-footer">
          <Link className="card-footer-item" href={post.fields.slug}>
            Lees meer →
          </Link>
        </footer>
      </div>
    </div>
  );
};

ProjectItem.propTypes = {
  post: PropTypes.object.isRequired, // Keep your propTypes
};

export default ProjectItem; // <--- DEFAULT EXPORT HERE
