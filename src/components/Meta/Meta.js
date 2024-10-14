import Head from 'next/head';

const siteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
const name = 'NVJK Kartik';
const twitterHandle = '';
const defaultOgImage = `https://i.postimg.cc/50vK3SLk/social-image1.png?v=1`;

export const Meta = ({ title, description, prefix = name, ogImage = defaultOgImage }) => {
  const titleText = [prefix, title].filter(Boolean).join(' | ');

  return (
    <Head>
      <title key="title">NVJK Kartik - Portfolio</title>
      <meta key="description" name="description" content={description} />
      <meta name="author" content={name} />

      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="Banner for the site" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1280" />
      <meta property="og:image:height" content="675" />

      <meta property="og:title" content={titleText} />
      <meta property="og:site_name" content={name} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:description" content={description} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:title" content={titleText} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
};
