// app/contact/page.js
// This component is a Server Component, meaning it runs on the server to fetch data.
// Do NOT add 'use client'; at the top of this file.

import React from 'react';
// import PropTypes from 'prop-types'; // ✨ REMOVED: PropTypes are not needed in App Router

// --- Markdown to HTML Conversion Libraries ---
import { remark } from 'remark';
import html from 'remark-html';

// --- Node.js Imports for Data Fetching ---
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// --- Next.js App Router Specific Imports ---
import { notFound } from 'next/navigation'; // ✨ NEW: For 404 handling

// --- Components (Assuming path aliases are set up) ---
import HTMLContent from '@/components/Content'; // ✨ IMPROVED: Use absolute import if configured
import ContactForm from '@/components/ContactForm'; // ✨ IMPROVED: Use absolute import if configured

// --- Site Metadata for SEO ---
import { siteMetadata } from '@/lib/site'; // ✨ IMPROVED: Use absolute import if configured

// --- Data Fetching Function ---
async function getContactPageData() {
  const contactFilePath = path.join(process.cwd(), 'content', 'pages', 'contact.md');

  try {
    const fileContents = fs.readFileSync(contactFilePath, 'utf8');
    const { data: frontmatter, content: markdownContent, excerpt } = matter(fileContents, { excerpt: true });

    const processedContent = await remark().use(html).process(markdownContent);
    const htmlContent = String(processedContent);

    return {
      address: frontmatter.address || 'N/A',
      phone: frontmatter.phone || 'N/A',
      email: frontmatter.email || 'N/A',
      facebook: frontmatter.facebook || '#',
      html: htmlContent,
      excerpt: excerpt || '',
      title: frontmatter.title || 'Contact',
    };
  } catch (error) {
    console.error(`Error reading contact page data from "${contactFilePath}":`, error);
    notFound(); // ✨ IMPROVED: Render Next.js's 404 page if data is not found
    // The code below would not be reached if notFound() is called, but kept for clarity.
    return {
      address: 'N/A', phone: 'N/A', email: 'N/A', facebook: '#',
      html: '<p>Sorry, the contact information could not be loaded.</p>',
      excerpt: '',
      title: 'Contact',
    };
  }
}

// ContactTemplate remains a Server Component as it doesn't use client-side hooks/browser APIs
export const ContactTemplate = ({ address, phone, email, facebook, content, contentComponent: PageContentComponent }) => {
  const PageContent = PageContentComponent;

  return (
    <div>
      {/* ✨ IMPROVED: Use CSS class for background color instead of inline style */}
      <section className="hero is-primary contact-hero-bg">
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
            <p><b>Facebook:</b> <a href={facebook} target="_blank" rel="noopener noreferrer">{facebook}</a></p>
          </div>
          <div className="section">
            // <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};

// ✨ REMOVED: PropTypes are not needed for App Router components

export async function generateMetadata() {
  const { title, excerpt } = await getContactPageData();
  return {
    title: `${siteMetadata.title} | ${title}`,
    description: excerpt || siteMetadata.description,
  };
}

export default async function ContactPage() {
  const { address, phone, email, facebook, html, title } = await getContactPageData();

  return (
    <ContactTemplate
      contentComponent={HTMLContent}
      address={address}
      phone={phone}
      email={email}
      facebook={facebook}
      content={html}
      title={title}
    />
  );
}
