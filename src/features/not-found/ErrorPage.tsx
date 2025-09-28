import React from 'react';
import styles from './ErrorPage.module.css';
import { notFoundImage } from '@/assets/images';
import Image from 'next/image';
import { useRouter } from 'next/router';

const ErrorPage: React.FC = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className={styles.errorPage}>
      <div className={styles.errorContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.headingWrapper}>
            <div className={styles.errorCode}>Error 404</div>
            <h1 className={styles.errorTitle}>Oops! page not found</h1>
          </div>
          <p className={styles.errorDescription}>
            Something went wrong. It&apos;s look that your requested could not be found. It&apos;s
            look like the link is broken or the page is removed.
          </p>
          <button className={styles.goBackButton} onClick={handleGoHome}>
            Go to Homepage
          </button>
        </div>
        <div className={styles.imageWrapper}>
          <Image
            loading="lazy"
            src={notFoundImage.background}
            className={styles.backgroundImage}
            alt=""
            width={50000}
            height={50000}
          />
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
