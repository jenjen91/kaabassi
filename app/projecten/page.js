// app/projecten/page.js
// This component is a Server Component by default, making it suitable for data fetching.

import React from 'react';
// import PropTypes from 'prop-types'; // No longer directly used for component props here
// import { graphql } from 'gatsby'; // Removed
// import Layout from '../components/Layout'; // Removed (handled by app/layout.js)

import ProjectItem from '../../components/ProjectItem'; // Adjust path based on your directory structure

// --- Node.js Imports for Data Fetching ---
// These run on the server, so you can use Node.js APIs like 'fs'
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'; // You'll need to install 'gray-matter': npm install gray-matter
import { siteMetadata } from '../../lib/site'; // Adjust path as needed for your siteMetadata

// Define the content directory. Adjust if your 'content' folder is named differently.
const contentDirectory = path.join(process.cwd(), 'content'); // Assumes 'content' folder is at root

// --- Data Fetching Function (Simulating Gatsby's `allMarkdownRemark` query with `getStaticProps` equivalent) ---
// This function will run on the server during rendering (at build time for static generation).
async function getProjects() {
  const blogDirectory = path.join(contentDirectory, 'projecten'); // Assuming projects are in 'content/blog'
  let fileNames = [];

  try {
    fileNames = fs.readdirSync(blogDirectory);
  } catch (error) {
    console.warn(`Could not read blog directory at ${blogDirectory}. Is it missing?`, error);
    return []; // Return empty if directory doesn't exist
  }

  const projects = fileNames.map((fileName) => {
    const fullPath = path.join(blogDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, excerpt } = matter(fileContents, { excerpt: true }); // extract frontmatter, excerpt

    // Simulate Gatsby's `fields.slug`
    const slug = `/projecten/${fileName.replace(/\.md$/, '')}`; // Adjust slug generation based on your routes

    // Prepare thumbnail info for `next/image`
    // Ensure `thumbnail` in frontmatter is a direct path string or object with src/width/height
    const thumbnailData = typeof data.thumbnail === 'string'
      ? { src: data.thumbnail, alt: data.title || '', width: 600, height: 400 } // Provide sensible defaults or fetch
      : data.thumbnail; // If frontmatter already provides an object with src, alt, width, height

    return {
      id: fileName, // Use filename as id for simplicity
      excerpt: excerpt || '', // Use the extracted excerpt
      fields: { slug },
      frontmatter: {
        title: data.title || '',
        templateKey: data.templateKey || '',
        date: data.date ? new Date(data.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' }) : '', // Format date
        thumbnail: thumbnailData,
        description: data.description || '',
      },
    };
  }).filter(project => project.frontmatter.templateKey === 'blog-post') // Filter by templateKey as per your Gatsby query
    .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)); // Sort by date DESC

  return projects;
}

// --- Metadata for the page ---
// This will be merged with the metadata from app/layout.js
export const metadata = {
  title: `${siteMetadata.title} | Projecten`, // Combine site title with page title
  description: siteMetadata.description, // Or a specific description for the projects page
};

// --- Projecten Page Component ---
export default async function ProjectenPage() {
  // Call the data fetching function directly within the Server Component
  // This happens on the server during rendering.
  const posts = await getProjects(); // Renamed to 'posts' for consistency with original render()

  return (
    // In App Router, the global Layout is handled by app/layout.js,
    // so you don't wrap with <Layout> here.
    <>
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
            .map((post) => (<ProjectItem post={post} key={post.id} />)
          )}
        </div>
      </section>
    </>
  );
}

// PropTypes are not needed here anymore as data is not passed via props in the same way.
// They are still relevant within the ProjectItem component for its own props validation.
