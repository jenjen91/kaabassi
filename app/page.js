// app/page.js
// This is a Server Component by default, allowing for direct data fetching.

import React from 'react';
import Link from 'next/link'; // For client-side navigation
import NetlifyIdentityScript from '../components/NetlifyIdentityScript'; // Your client component for Netlify Identity
import ProjectItem from '../components/ProjectItem';

// --- Data Fetching Dependencies ---
// These Node.js modules run on the server to read your content files.
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'; // Make sure you have 'gray-matter' installed: npm install gray-matter

// --- Markdown Content for the Homepage (home.md) ---
// This import pattern leverages your webpack configuration to read the markdown.
import { attributes as homeAttributes, react as HomeContent } from '../content/home.md';

// --- Data Fetching Function for Blog Posts (Projects) ---
// This function simulates Gatsby's GraphQL query for markdown files.
async function getPosts() {
  const blogDirectory = path.join(process.cwd(), 'content', 'projecten'); // Path to your blog posts
  let fileNames = [];

  try {
    fileNames = fs.readdirSync(blogDirectory);
  } catch (error) {
    console.warn(`Could not read blog directory at ${blogDirectory}. Is it missing?`, error);
    return []; // Return empty if directory doesn't exist
  }

  const posts = fileNames.map((fileName) => {
    const fullPath = path.join(blogDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, excerpt } = matter(fileContents, { excerpt: true }); // Extract frontmatter and excerpt

    // Simulate Gatsby's `fields.slug` for routing
    const slug = `/projecten/${fileName.replace(/\.md$/, '')}`; // Adjust this to match your actual route structure

    // Prepare thumbnail info for `next/image`
    // Ensure `data.thumbnail` contains a direct path string (e.g., '/img/project-thumbs/my-image.jpg')
    const thumbnailData = typeof data.thumbnail === 'string'
      ? { src: data.thumbnail, alt: data.title || '', width: 600, height: 400 } // Default width/height, adjust as needed or fetch from frontmatter
      : data.thumbnail; // If frontmatter already provides an object with src, alt, width, height

    return {
      id: fileName, // Using filename as a unique ID
      excerpt: excerpt || '',
      fields: {slug},
      frontmatter: {
        title: data.title || '',
        templateKey: data.templateKey || '',
        date: data.date ? new Date(data.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
        thumbnail: thumbnailData,
        description: data.description || '',
      },
    };
  })
  .filter(post => post.frontmatter.templateKey === 'blog-post') // Filter posts by templateKey
  .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)); // Sort by date descending

  return posts;
}

// --- Metadata for this Page ---
// This combines global site metadata with page-specific metadata.
// It will be merged with the metadata from app/layout.js.
export const metadata = {
  title: homeAttributes.title,
  description: homeAttributes.description || 'Welcome to our website.',
};

// --- Home Page Component ---
export default async function HomePage() {
  // Destructure attributes from the home.md content
  const { title: homeTitle, cats } = homeAttributes;

  // Fetch the blog posts (projects) on the server side
  const posts = await getPosts();

  return (
    <>
      {/* Netlify Identity script, loaded via a client component */}
      <NetlifyIdentityScript />

      {/* Projects Section (from your old index.js) */}
      <section className="section">
        <div className="container">
          <div className="content">
            <h1 className="front-header">
              <Link href="/about">Over ons</Link>
            </h1>
            <section className="section">
              <p>
                Kaabassi is een non-profit organisatie die zich bezighoudt met het
                ondersteunen van mensen die zich op de één of andere manier buitengesloten
                voelen.
              </p>
            </section>
            <h1 className="front-header">
              <Link href="/projecten">Projecten</Link>
            </h1>
            <center>Al onze projecten in Den Haag</center>
          </div>
          <section className="section">
            <div className="columns project-container">
              {posts.map((post) => (
                <ProjectItem post={post} key={post.id} />
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
