// components/NetlifyIdentityScript.js
'use client'; // Mark this component as a Client Component

import Script from 'next/script';
import React from 'react'; // Not strictly necessary to import React if only using Script, but good practice

export default function NetlifyIdentityScript() {
  return (
    <Script
      src="https://identity.netlify.com/v1/netlify-identity-widget.js"
      strategy="beforeInteractive" // Or 'afterInteractive' if you prefer
      onLoad={() => {
        // This code will now run in the browser when the script loads
        if (window.netlifyIdentity) {
          window.netlifyIdentity.init();
        }
        console.log('Netlify Identity script loaded and initialized!');
      }}
    />
  );
}
