// app/projecten/[slug]/page.js
// This component is a Server Component, responsible for fetching dynamic data.
// Do NOT add 'use client'; at the top of this file, as it uses server-only Node.js modules.

import React from 'react';
import PropTypes from 'prop-types'; // For runtime type checking of components
import { kebabCase } from 'lodash'; // Used for generating tag slugs

// --- Next.js Specific Imports ---
import Link from 'next/link'; // Replaces Gatsby's Link for internal navigation
import { siteMetadata } from '../../../lib/site'; // Adjust this path if your siteMetadata is located elsewhere

// --- Markdown to HTML Conversion Libraries ---
import { remark } from 'remark'; // Core markdown processor
import html from 'remark-html';  // Plugin to convert markdown AST to HTML

// --- File System and Markdown Parsing ---
import fs from 'fs';   // Node.js file system module for reading files
import path from 'path'; // Node.js path module for resolving file paths
import matter from 'gray-matter'; // For parsing frontmatter from markdown files

// --- Components ---
import HTMLContent from '../../../components/Content'; // Adjust this path. Assumes HTMLContent is the DEFAULT export from Content.js

// --- Configuration for Markdown File Location ---
// IMPORTANT: Adjust this path to where your project markdown files are actually stored.
// Example: If your files are in `your-project-root/content/projects/`, set it to `content/projects`
const PROJECTS_DIRECTORY = path.join(process.cwd(), 'content', 'projecten');

// --- Helper function to get all project slugs for Next.js's generateStaticParams ---
// This function reads the file system to find all available project slugs.
async function getAllProjectSlugs() {
  const fileNames = fs.readdirSync(PROJECTS_DIRECTORY);
  // Assuming each markdown file's name (e.g., 'my-project.md') is its slug.
  const slugs = fileNames.map(fileName => fileName.replace(/\.md$/, ''));
  return slugs;
}

// --- Helper function to get a single project's data by its slug ---
// This function reads a specific markdown file, parses its content, and converts markdown to HTML.
async function getProjectData(slug) {
  const fullPath = path.join(PROJECTS_DIRECTORY, `${slug}.md`);

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data: frontmatter, content: markdownContent, excerpt } = matter(fileContents, { excerpt: true });

    // Convert the markdown content (text) into HTML (string with tags)
    const processedContent = await remark().use(html).process(markdownContent);
    const htmlContent = String(processedContent); // Convert the VFile object to a string

    // Format the date for display (similar to Gatsby's formatString)
    const formattedDate = frontmatter.date
      ? new Intl.DateTimeFormat('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(frontmatter.date))
      : '';

    return {
      id: slug, // Using the slug as a unique ID for this context
      html: htmlContent,
      frontmatter: {
        date: formattedDate,
        title: frontmatter.title || slug, // Fallback to slug if no title in frontmatter
        description: frontmatter.description || '', // Fallback to empty string
        tags: frontmatter.tags || [], // Fallback to empty array if no tags
      },
      excerpt: excerpt || '', // Fallback to empty string
    };
  } catch (error) {
    console.error(`Error reading project data for slug "${slug}":`, error);
    // In a production application, you might want to use Next.js's `notFound()`
    // function here to render a custom 404 page:
    // import { notFound } from 'next/navigation';
    // notFound();
    return null; // Return null if data fetching fails, to be handled by the main component
  }
}


export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map(slug => ({
    slug: slug, // The object key must match the dynamic segment name in the folder (e.g., `[slug]`)
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = await getProjectData(slug); // Fetch data to get title and description for metadata

  if (!post) {
    return {
      title: `${siteMetadata.title} | Project Niet Gevonden`,
      description: 'De gevraagde projectpagina bestaat niet.',
    };
  }

  return {
    title: `${siteMetadata.title} | ${post.frontmatter.title}`,
    description: post.frontmatter.description || siteMetadata.description,
    // You can add more meta tags here, e.g., Open Graph, Twitter cards:
    // openGraph: {
    //   title: post.frontmatter.title,
    //   description: post.frontmatter.description,
    //   url: `${siteMetadata.siteUrl}/projecten/${slug}`,
    //   // images: [{ url: post.frontmatter.image?.src }],
    // },
  };
}

export const BlogPostTemplate = ({
  content,
  contentComponent: PostContentComponent, // Renamed from 'contentComponent' to avoid confusion if 'Content' is also imported
  description,
  tags,
  title,
  // The 'helmet' prop from Gatsby is no longer needed here, as `generateMetadata` handles SEO
}) => {
  // Use the provided contentComponent (which should be HTMLContent)
  const PostContent = PostContentComponent;

  return (
    <section className="section">
      {/* Remove {helmet || ''} */}
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
              {title}
            </h1>
            <p>{description}</p>
            {/* Render the HTML content */}
            <PostContent content={content} />
            {tags && tags.length > 0 ? (
              <div style={{ marginTop: `4rem` }}>
                <h4>Tags</h4>
                <ul className="taglist">
                  {tags.map(tag => (
                    <li key={tag + `tag`}>
                      {/* Use Next.js's Link component for internal navigation */}
                      <Link href={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

// PropTypes for BlogPostTemplate for type checking
BlogPostTemplate.propTypes = {
  content: PropTypes.string.isRequired, // Expecting the HTML string here
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string), // Array of strings for tags
};

export default async function ProjectDetailPage({ params }) {
  const { slug } = params; // Get the dynamic slug from the URL parameters
  const post = await getProjectData(slug); // Fetch all data for this specific project

  // Handle the case where the project data couldn't be found
  if (!post) {
    // You can customize this fallback UI or let Next.js's app/not-found.js handle it
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Project Not Found</h1>
        <p>The project you are looking for does not exist.</p>
        <Link href="/projecten">Go back to all projects</Link>
      </div>
    );
  }

  return (
    // In the App Router, the global layout (like a header/footer) is typically
    // handled by `app/layout.js`, so you don't wrap with `<Layout>` here.
    <BlogPostTemplate
      content={post.html} // Pass the converted HTML content
      contentComponent={HTMLContent} // Specify the component to render HTML
      description={post.frontmatter.description}
      // The 'helmet' prop is no longer passed or used by the template
      tags={post.frontmatter.tags}
      title={post.frontmatter.title}
    />
  );
}

// PropTypes are generally not needed for the main page component in App Router
// as it directly fetches its data and doesn't receive complex props from a higher component.
