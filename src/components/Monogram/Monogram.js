import { forwardRef, useId } from 'react';
import { classes } from 'utils/style';
import styles from './Monogram.module.css';

export const Monogram = forwardRef(({ highlight, className, ...props }, ref) => {
  const id = useId();
  const clipId = `${id}monogram-clip`;

  return (
    <div style={{ transform: 'rotate(0deg)' }}>
      <svg
        aria-hidden
        className={classes(styles.monogram, className)}
        width="32"
        height="32"
        viewBox="0 0 32 32"
        ref={ref}
        {...props}
      >
        <defs>
          <clipPath id={clipId}>
          <path d="M16 2 L2 16 L6 16 L6 30 L26 30 L26 16 L30 16 Z M12 30 L12 20 L20 20 L20 30 Z" />
          </clipPath>
        </defs>
        <rect clipPath={`url(#${clipId})`} width="100%" height="100%"/>
        {highlight && (
          <g clipPath={`url(#${clipId})`}>
            <rect className={styles.highlight} width="100%" height="100%" />
          </g>
        )}
      </svg>
    </div>
  );
});