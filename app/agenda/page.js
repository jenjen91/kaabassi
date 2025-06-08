// app/agenda/page.js
// This component is a Server Component by default, allowing for direct data fetching.

import React from 'react';
import PropTypes from 'prop-types';

// --- Markdown to HTML Conversion Libraries ---
import { remark } from 'remark'; // <--- ENSURE THIS LINE IS HERE
import html from 'remark-html';  // <--- AND THIS LINE IS HERE

import HTMLContent from '../../components/Content'; // HTMLContent is now the default export
import PreviewCompatibleImage from '../../components/PreviewCompatibleImage'; // Adjust path
import { siteMetadata } from '../../lib/site'; // Adjust path for your siteMetadata

// --- Node.js Imports for Data Fetching ---
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// --- Data Fetching Function ---
async function getAgendaPageData() {
  const agendaFilePath = path.join(process.cwd(), 'content', 'pages', 'agenda.md'); // Adjust this path if incorrect

  try {
    const fileContents = fs.readFileSync(agendaFilePath, 'utf8');
    const { data: frontmatter, content: markdownContent, excerpt } = matter(fileContents, { excerpt: true });

    // --- CONVERT MARKDOWN TO HTML HERE ---
    const processedContent = await remark().use(html).process(markdownContent);
    const htmlContent = String(processedContent); // Convert VFile to string

    const imageData = typeof frontmatter.image === 'string'
      ? { src: frontmatter.image, alt: frontmatter.title || '', width: 1200, height: 600 }
      : frontmatter.image;

    return {
      title: frontmatter.title || 'Agenda',
      subtitle: frontmatter.subtitle || '',
      image: imageData,
      html: htmlContent, // <--- NOW PASSING CONVERTED HTML
      excerpt: excerpt || '',
    };
  } catch (error) {
    console.error(`Error reading agenda page data from ${agendaFilePath}:`, error);
    return {
      title: 'Page Not Found',
      subtitle: 'Could not load agenda content.',
      image: null,
      html: '<p>Sorry, the content for this page could not be loaded.</p>',
      excerpt: '',
    };
  }
}

// --- AgendaPageTemplate (remains a presentational component) ---
export const AgendaPageTemplate = ({
  title,
  subtitle,
  image,
  content, // This 'content' prop is the HTML string
  contentComponent: PageContentComponent // This 'PageContentComponent' is HTMLContent
}) => {
  const PageContent = PageContentComponent; // PageContent is assigned HTMLContent

  return (
    <div>
      <section className="hero is-info" style={{backgroundColor: '#277700'}}>
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              <h1 className="has-text-weight-bold is-size-2">{title}</h1>
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
            {image && (
              <div className="column is-half">
                <PreviewCompatibleImage imageInfo={image} />
              </div>
            )}
            <div className={`column ${image ? '' : 'is-full'}`}>
              <PageContent className="content" content={content} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// PropTypes for AgendaPageTemplate
AgendaPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
};

// --- Metadata for the page ---
export async function generateMetadata() {
  const { title, excerpt } = await getAgendaPageData();
  return {
    title: `${siteMetadata.title} | ${title}`,
    description: excerpt || siteMetadata.description,
  };
}

// --- Main AgendaPage Component (async Server Component) ---
export default async function AgendaPage() {
  const { title, subtitle, image, html } = await getAgendaPageData();

  return (
    <AgendaPageTemplate
      image={image}
      content={html} // 'html' is the *converted HTML string* from getAgendaPageData
      contentComponent={HTMLContent} // Passes the HTMLContent component itself
      title={title}
      subtitle={subtitle}
    />
  );
}
