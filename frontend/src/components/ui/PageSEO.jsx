import { Helmet } from 'react-helmet-async';

const PageSEO = ({ title, description }) => {
  const baseTitle = "EarthWatch";
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || "Global Earthquake Analytics Dashboard"} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || "Global Earthquake Analytics Dashboard"} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default PageSEO;
