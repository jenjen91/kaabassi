// app/contact/page.js
// This component is a Server Component, meaning it runs on the server to fetch data.
// Do NOT add 'use client'; at the top of this file, as it uses server-only Node.js modules.

import React from 'react';
import PropTypes from 'prop-types'; // For type checking of the ContactTemplate component

// --- Markdown to HTML Conversion Libraries ---
import { remark } from 'remark'; // Core markdown processor
import html from 'remark-html';  // Plugin to convert markdown AST to HTML

// --- Node.js Imports for Data Fetching ---
import fs from 'fs';   // Node.js file system module for reading files
import path from 'path'; // Node.js path module for resolving file paths
import matter from 'gray-matter'; // For parsing frontmatter from markdown files

// --- Components ---
import HTMLContent from '../../components/Content'; // Adjust this path if your Content.js is elsewhere.
                                                  // Assumes HTMLContent is the DEFAULT export from Content.js.
import ContactForm from '../../components/ContactForm'; // Adjust this path for your ContactForm component.
                                                    // Moved to components folder for better structure.

// --- Site Metadata for SEO ---
import { siteMetadata } from '../../lib/site'; // Adjust this path if your siteMetadata is located elsewhere.

// --- Data Fetching Function ---
// This function reads and parses the markdown file for the contact page.
async function getContactPageData() {
  // IMPORTANT: Adjust this path to where your contact page markdown file is located.
  // Example: your-project-root/content/pages/contact.md
  const contactFilePath = path.join(process.cwd(), 'content', 'pages', 'contact.md');

  try {
    const fileContents = fs.readFileSync(contactFilePath, 'utf8');
    const { data: frontmatter, content: markdownContent, excerpt } = matter(fileContents, { excerpt: true });

    // Convert the markdown content (text) into HTML (string with tags)
    const processedContent = await remark().use(html).process(markdownContent);
    const htmlContent = String(processedContent); // Convert the VFile object to a string

    return {
      // Frontmatter fields directly from the markdown file
      address: frontmatter.address || 'N/A',
      phone: frontmatter.phone || 'N/A',
      email: frontmatter.email || 'N/A',
      facebook: frontmatter.facebook || '#', // Provide a fallback if no Facebook link
      // Content body converted to HTML
      html: htmlContent,
      // Excerpt for metadata, if available
      excerpt: excerpt || '',
      // Title for metadata (often hardcoded for contact page, or from frontmatter)
      title: frontmatter.title || 'Contact',
    };
  } catch (error) {
    console.error(`Error reading contact page data from "${contactFilePath}":`, error);
    // In a production app, you might want to use Next.js's `notFound()` here
    // import { notFound } from 'next/navigation'; notFound();
    return {
      address: 'N/A', phone: 'N/A', email: 'N/A', facebook: '#',
      html: '<p>Sorry, the contact information could not be loaded.</p>',
      excerpt: '',
      title: 'Contact',
    };
  }
}


export const ContactTemplate = ({ address, phone, email, facebook, content, contentComponent: PageContentComponent }) => {
  // Use the provided contentComponent (which should be HTMLContent)
  const PageContent = PageContentComponent;

  return (
    <div>
      <section className="hero is-primary" style={{ backgroundColor: '#277700' }}>
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Contact</h1> {/* Hardcoded title as per original template */}
          </div>
        </div>
      </section>
      <section className="section section--gradient">
        <div className="container">
          {/* Render the HTML content from the markdown body */}
          <PageContent className="content" content={content} />
          <div className="section">
            <p><b>Address:</b> {address}</p>
            <p><b>Tel:</b> {phone}</p>
            <p><b>Email:</b> <a href={`mailto:${email}`}>{email}</a></p>
            <p><b>Facebook:</b> <a href={facebook} target="_blank" rel="noopener noreferrer">{facebook}</a></p>
          </div>
          <div className="section">
            {/* The ContactForm component */}
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};

// PropTypes for ContactTemplate for development-time type checking
ContactTemplate.propTypes = {
  address: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
  facebook: PropTypes.string,
  content: PropTypes.string, // Expecting the HTML string here
  contentComponent: PropTypes.func,
};

export async function generateMetadata() {
  const { title, excerpt } = await getContactPageData(); // Fetch data for metadata
  return {
    title: `${siteMetadata.title} | ${title}`,
    description: excerpt || siteMetadata.description,
  };
}

export default async function ContactPage() {
  // Fetch all contact page data
  const { address, phone, email, facebook, html, title } = await getContactPageData();

  return (
    // In the App Router, the global layout (like a header/footer) is handled by
    // `app/layout.js`, so you typically don't wrap the content with a <Layout> component here.
    <ContactTemplate
      contentComponent={HTMLContent} // Specify the component to render HTML
      address={address}
      phone={phone}
      email={email}
      facebook={facebook}
      content={html} // Pass the converted HTML content
      title={title} // Pass title if template uses it, though it's hardcoded in template
    />
  );
}

// PropTypes are generally not needed for the main page component in App Router
// as it directly fetches its data and doesn't receive complex props from a higher component.
