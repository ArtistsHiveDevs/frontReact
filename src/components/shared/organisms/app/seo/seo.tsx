import React from 'react';
import { Helmet } from 'react-helmet-async';

// Define las propiedades del objeto de SEO
interface SEOProps {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, url, image, type = 'website' }) => {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      {type && <meta property="og:type" content={type} />}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default SEO;
