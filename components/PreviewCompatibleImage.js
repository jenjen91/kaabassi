// components/PreviewCompatibleImage.js
'use client'; // This component will be rendered on the client side because it uses `next/image`

import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image'; // Import Next.js Image component

const PreviewCompatibleImage = ({ imageInfo }) => {
  const imageStyle = { borderRadius: '5px' }; // Your existing style

  // Destructure imageInfo. Assume a more consistent structure for Next.js.
  // We'll prioritize `src`, `alt`, `width`, `height` directly from `imageInfo`
  // or fallback to nested properties if that's how your data is structured post-Gatsby migration.
  const { alt = '', image } = imageInfo;

  let imgSrc = null;
  let imgAlt = alt;
  let imgWidth = null;
  let imgHeight = null;

  // --- Scenario 1: Image data directly contains src, width, height (ideal for Next.js/CMS) ---
  // This is the preferred structure after migrating from Gatsby's image processing.
  // Example: { src: '/img/my-image.jpg', alt: '...', width: 600, height: 400 }
  if (image && typeof image === 'object' && image.src) {
    imgSrc = image.src;
    imgAlt = image.alt || alt;
    imgWidth = image.width;
    imgHeight = image.height;
  }
  // --- Scenario 2: Image is a direct string path (from frontmatter like "thumbnail: /img/my-image.jpg") ---
  else if (typeof image === 'string') {
    imgSrc = image;
    // For string `src`, we need to guess or get width/height from somewhere else.
    // This is often a weak point when migrating from Gatsby-Image.
    // YOU WILL LIKELY NEED TO SET SENSIBLE DEFAULTS OR PULL FROM DATA.
    // The browser will give a warning if width/height are missing for static images.
    imgWidth = imageInfo.width || 600;  // Fallback default
    imgHeight = imageInfo.height || 400; // Fallback default
  }
  // --- Scenario 3: Handle the Gatsby `childImageSharp` leftovers (if still present in data) ---
  // This is less ideal for a pure Next.js setup as you won't have `childImageSharp`
  // unless you're processing images in a custom Node.js build step that mimics Gatsby.
  // We'll fall back to it if nothing else works, but it might break if the object structure
  // doesn't directly give a usable `src`.
  else if (imageInfo.childImageSharp && imageInfo.childImageSharp.fluid) {
      // Gatsby's fluid object contains `src`, `srcSet`, `sizes`.
      // For Next.js, we just need the base `src`.
      imgSrc = imageInfo.childImageSharp.fluid.src;
      // You still need to provide width/height for next/image,
      // which are not directly available on `fluid` in an obvious way without parsing
      // or knowing the original image dimensions. This is a common migration challenge.
      // SET SENSIBLE DEFAULTS OR PULL FROM YOUR NEW DATA SOURCE.
      imgWidth = imageInfo.width || 600;
      imgHeight = imageInfo.height || 400;
  }
  // --- Scenario 4: If `image` itself is the imageInfo (from ProjectItem passing `thumbnailImageInfo`) ---
  // This covers the case where `imageInfo` itself is already the object with `src`, `alt`, `width`, `height`
  // as prepared in `ProjectItem.js`.
  else if (typeof imageInfo === 'object' && imageInfo.src) {
      imgSrc = imageInfo.src;
      imgAlt = imageInfo.alt || alt;
      imgWidth = imageInfo.width;
      imgHeight = imageInfo.height;
  }


  // --- Render with next/image if we have a valid src ---
  if (imgSrc) {
    // You might want to add `placeholder="blur"` and `blurDataURL` for blur-up effect,
    // but that requires more setup for local images.
    return (
      <Image
        style={imageStyle}
        src={imgSrc}
        alt={imgAlt}
        width={imgWidth || 600}   // Fallback width if still null
        height={imgHeight || 400} // Fallback height if still null
        // layout="responsive" // `layout` prop is deprecated in Next.js 13+, prefer `fill` or CSS for sizing
        // objectFit="cover"   // Example: if you want the image to cover the area
      />
    );
  }

  // Fallback if no valid image source is found
  return null; // Or render a placeholder div/image
};

PreviewCompatibleImage.propTypes = {
  imageInfo: PropTypes.oneOfType([
    PropTypes.string, // For direct string paths
    PropTypes.shape({
      alt: PropTypes.string,
      src: PropTypes.string, // For src directly on imageInfo (Scenario 4)
      width: PropTypes.number,
      height: PropTypes.number,
      childImageSharp: PropTypes.object, // For Gatsby legacy (Scenario 3)
      image: PropTypes.oneOfType([ // For `image` property (Scenario 1 & 2)
        PropTypes.string, // Direct string path for `image`
        PropTypes.shape({
          src: PropTypes.string.isRequired, // Object with src
          alt: PropTypes.string,
          width: PropTypes.number,
          height: PropTypes.number,
        }),
      ]),
    }),
  ]).isRequired,
};

export default PreviewCompatibleImage;
