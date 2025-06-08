// app/layout.js
import React from 'react';
import Navbar from '../components/Navbar'; // Adjust path if needed
import '../styles/all.sass'; // Import your global Sass file
import { siteMetadata } from '../lib/site'; // Import your site metadata
import Link from 'next/link';
import Image from 'next/image';
// --- Metadata export for App Router ---
// This replaces the Head component for static metadata
export const metadata = {
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`, // Optional: For dynamic page titles
  },
  description: siteMetadata.description,
  // Other meta tags can go here, e.g., openGraph, twitter
  // For html lang, it's usually handled by the <html> tag itself in the layout
};

// --- Root Layout Component ---
export default function RootLayout({ children }) {
  return (
    // Set lang attribute directly on the <html> tag
    <html lang="en" data-theme="light">
      <body>
        <Navbar />
        <main>{children}</main> {/* The `children` prop will be your page content */}
        <footer className="footer fixed-grid">
          <div className="grid is-justify-content-center is-align-content-center is-align-items-center	">
            <div className="cell">
              <Link href="/" className="navbar-item" title="Logo">
                <Image
                  src="/img/kaabassi-logo.png"
                  alt="Stichting Kaabassi Logo"
                  width={60}
                  height={60.3}
                />
              </Link>
            </div>
            <div className="cell"><p>
              <strong>Stichting Kaabassi</strong>
            </p></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
