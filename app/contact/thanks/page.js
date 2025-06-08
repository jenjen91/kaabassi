// app/contact/thanks/page.js
// This is a Server Component by default.

import React from 'react';
import { siteMetadata } from '../../../lib/site'; // Adjust this path if your siteMetadata is located elsewhere
import Link from 'next/link'; // For client-side navigation back to the homepage

// --- Metadata Generation ---
// This function sets the SEO title and description for the "Thank You" page.
export async function generateMetadata() {
  return {
    title: `${siteMetadata.title} | Thank You!`, // Example: "Awesome Kitties | Thank You!"
    description: 'Thank you for contacting us. Your message has been received.',
  };
}

// --- Main "Thank You" Page Component ---
export default function ContactThanksPage() {
  return (
    <div>
      {/* Hero Section - Consistent with your Contact page */}
      <section className="hero is-primary" style={{ backgroundColor: '#277700' }}>
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Thank You!</h1>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="section section--gradient">
        <div className="container content">
          <div className="columns">
            <div className="column is-10 is-offset-1">
              <p>Your message has been successfully sent. We appreciate you reaching out to us and will get back to you as soon as possible!</p>
              <p>
                In the meantime, feel free to explore more of our website:
              </p>
              <div className="buttons">
                {/* Link back to the homepage */}
                <Link href="/" className="button is-link">
                  Go to Homepage
                </Link>
                {/* Optional: Link to another relevant page, e.g., Projects */}
                {/* <Link href="/projecten" className="button is-light">
                  View Our Projects
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
