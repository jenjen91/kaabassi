// app/about/page.js
// This component is a Server Component by default, allowing for direct data fetching.
// Do NOT add 'use client'; at the top of this file, as it uses server-only Node.js modules.

import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for runtime type checking

// --- Markdown to HTML Conversion Libraries ---
import { remark } from 'remark';
import html from 'remark-html';

import HTMLContent from '../../components/Content'; // Assuming HTMLContent is the DEFAULT export from Content.js
import PreviewCompatibleImage from '../../components/PreviewCompatibleImage'; // Adjust path
import { siteMetadata } from '../../lib/site'; // Adjust path for your siteMetadata

// --- Node.js Imports for Data Fetching ---
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'; // Make sure you have 'gray-matter' installed: npm install gray-matter

// --- Data Fetching Function ---
// This function will read and parse the specific markdown file for the about page.
async function getAboutPageData() {
  // Define the path to your about markdown file.
  // IMPORTANT: Verify this path matches your project's actual structure!
  // Example: your-project-root/content/pages/about.md
  const aboutFilePath = path.join(process.cwd(), 'content', 'pages', 'about.md');

  try {
    const fileContents = fs.readFileSync(aboutFilePath, 'utf8');
    const { data: frontmatter, content: markdownContent, excerpt } = matter(fileContents, { excerpt: true });

    // Convert Markdown to HTML using remark
    const processedContent = await remark().use(html).process(markdownContent);
    const htmlContent = String(processedContent); // Convert VFile to string

    // Prepare image info for PreviewCompatibleImage (adjust width/height or fetch from frontmatter)
    const imageData = typeof frontmatter.image === 'string'
      ? { src: frontmatter.image, alt: frontmatter.title || '', width: 2048, height: 1024 } // Default for hero images, adjust as needed
      : frontmatter.image; // If frontmatter already provides an object with src, alt, width, height

    return {
      title: frontmatter.title || 'Over Ons', // Fallback title
      subtitle: frontmatter.subtitle || '',
      image: imageData,
      html: htmlContent, // This is the converted HTML string
      excerpt: excerpt || '',
    };
  } catch (error) {
    console.error(`Error reading about page data from ${aboutFilePath}:`, error);
    // In a production app, you might want to throw notFound() here if the file is critical
    // import { notFound } from 'next/navigation';
    // notFound();
    return {
      title: 'Pagina Niet Gevonden',
      subtitle: 'Inhoud kon niet geladen worden.',
      image: null,
      html: '<p>Sorry, de inhoud voor deze pagina kon niet geladen worden.</p>',
      excerpt: '',
    };
  }
}

export const AboutPageTemplate = ({ title, subtitle, image, content, contentComponent: PageContentComponent }) => {
  // PageContentComponent should be HTMLContent, imported as default
  const PageContent = PageContentComponent;

  return (
    <div>
      <section className="hero is-primary" style={{ backgroundColor: '#277700' }}>
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              {title}
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
            <div className="column">
              <div className="section">
                {/* content is now the HTML string, PageContent will render it */}
                <PageContent className="content" content={content} />
              </div>
            </div>
            {image && ( // Only render image column if image data exists
              <div className="column is-half">
                <PreviewCompatibleImage imageInfo={image} />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

// PropTypes for AboutPageTemplate (for development-time type checking)
AboutPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  content: PropTypes.string, // Now expecting the HTML string
  contentComponent: PropTypes.func, // Expecting a function component like HTMLContent
};

export async function generateMetadata() {
  const { title, excerpt } = await getAboutPageData();
  return {
    title: `${siteMetadata.title} | ${title}`,
    description: excerpt || siteMetadata.description, // Use excerpt for description if available
  };
}

export default async function AboutPage() {
  // Fetch data directly within this Server Component
  const { title, subtitle, image, html } = await getAboutPageData();

  return (
    // In App Router, the global layout is handled by app/layout.js,
    // so you don't wrap with <Layout> here.
    <AboutPageTemplate
      contentComponent={HTMLContent} // Pass the HTMLContent component
      title={title}
      subtitle={subtitle}
      image={image}
      content={html} // Pass the converted HTML content string
    />
  );
}
