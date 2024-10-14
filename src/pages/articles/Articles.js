// components/Articles.js
import Barcode from 'assets/barcode.svg';
import { Button } from 'components/Button';
import { DecoderText } from 'components/DecoderText';
import { Divider } from 'components/Divider';
import { Footer } from 'components/Footer';
import { Heading } from 'components/Heading';
import { Image } from 'components/Image';
import { Meta } from 'components/Meta';
import { Section } from 'components/Section';
import { Text } from 'components/Text';
import { useReducedMotion } from 'framer-motion';
import { useWindowSize } from 'hooks';
import { useState, useEffect } from 'react';
import { formatDate } from 'utils/date';
import { classes, cssProps } from 'utils/style';
import Link from 'next/link';
import styles from './Articles.module.css';


const ArticlesPost = ({
  title,
  abstract,
  date,
  featured,
  banner,
  slug,        //  Make sure you're receiving the 'slug' prop
  index,
}) => {
  const [hovered, setHovered] = useState(false);
  const [dateTime, setDateTime] = useState(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setDateTime(formatDate(date));
  }, [date]);

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);


  return (
    <article
      className={styles.post}
      data-featured={!!featured}
      style={index !== undefined ? cssProps({ delay: index * 100 + 200 }) : undefined}
    >
      {featured && (
        <Text className={styles.postLabel} size="s">
          Featured
        </Text>
      )}

      {featured && banner && ( // Simplified conditional
        <div className={styles.postImage}>
          <Image
            noPauseButton
            play={!reduceMotion ? hovered : undefined}
            src={{ src: banner }}
            placeholder={{ src: `${banner.split('.')[0]}-placeholder.jpg` }}
            alt=""
            role="presentation"
          />
        </div>
      )}

<Link href={`/articles/${slug}`} passHref>
    <a 
              className={styles.postLink}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
    >
    <div className={styles.postDetails}>
      <div aria-hidden className={styles.postDate}>
      <Divider notchWidth="64px" notchHeight="8px" /> 
      {dateTime}
      </div>
       <Heading as="h2" level={featured ? 2 : 4}>
          {title}
        </Heading>
        <Text size={featured ? 'l' : 's'} as="p">
          {abstract}
        </Text>
        <div className={styles.postFooter}>
          <Button secondary iconHoverShift icon="chevronRight" as="div">
            Read here
          </Button>
        </div>
      </div>
      </a>
  </Link>

      {featured && (
        <Text aria-hidden className={styles.postTag} size="s">
        NEW
        </Text>
      )}
    </article>
  );
};



export const Articles = ({ posts, featured }) => {
  const { width } = useWindowSize();
  const singleColumnWidth = 1190;
  const isSingleColumn = width <= singleColumnWidth;

  const postsHeader = (
    <header className={styles.header}>
      <Heading className={styles.heading} level={5} as="h1">
        <DecoderText text="Publications" />
      </Heading>
      <Barcode />
    </header>
  );


  const postList = (
    <div className={styles.list}>
      {!isSingleColumn && postsHeader}
      {posts.map((post, index) => (
        <ArticlesPost key={post.title} index={index} {...post} />
      ))}
    </div>
  );

  const featuredPost = featured ? <ArticlesPost key={featured.title} {...featured} /> : null;


  return (
    <article className={styles.articles}>
      <Meta
        title="Articles"
        description="A collection of technical design and development articles."
      />
      <Section className={styles.content}>
        {!isSingleColumn && (
          <div className={styles.grid}>
            {postList}
            {featuredPost}
          </div>
        )}
        {isSingleColumn && (
          <div className={styles.grid}>
            {postsHeader}
            {featuredPost}
            {postList}
          </div>
        )}
      </Section>
      <Footer />
    </article>
  );
};