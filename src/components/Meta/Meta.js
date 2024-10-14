import Head from 'next/head';

const siteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://yourwebsite.com'; // Fallback URL
const name = 'NVJK Kartik';
const twitterHandle = '@10kkkartikkk01';
const defaultOgImage = `https://i.postimg.cc/50vK3SLk/social-image1.png`;
const defaultDescription = "This is the portfolio site of NVJK Kartik, showcasing projects, experiences, and more.";

export const Meta = ({ description = defaultDescription, ogImage = defaultOgImage }) => {
  return (
    <Head>
      <title>NVJK Kartik - Portfolio</title> {/* Fixed Title */}
      <meta key="description" name="description" content={description} />
      <meta name="author" content={name} />

      {/* Open Graph Meta */}
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:alt" content="Banner for the site" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1280" />
      <meta property="og:image:height" content="675" />

      <meta property="og:title" content="NVJK Kartik - Portfolio" />
      <meta property="og:site_name" content={name} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:description" content={description} />

      {/* Twitter Meta */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:title" content="NVJK Kartik - Portfolio" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
};
