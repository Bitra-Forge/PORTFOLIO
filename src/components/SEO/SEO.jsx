import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'BitraForge',
  description = 'A curated selection of industrial-grade digital artifacts, engineered for high-performance and visual dominance.',
  image = '/og-image.png',
  url = '',
  type = 'website'
}) => {
  const siteTitle = title === 'BitraForge' ? title : `${title} | BitraForge`;
  const fullUrl = url ? `https://bitra.io${url}` : 'https://bitra.io/';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
};

export default SEO;
