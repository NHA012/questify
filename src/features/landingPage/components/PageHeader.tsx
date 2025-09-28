import React from 'react';
import styles from './PageHeader.module.css';
import { useRouter } from 'next/router';
import { landingPageImage } from '@/assets/images';

const PageHeader: React.FC<{ currentUser }> = ({ currentUser }) => {
  const router = useRouter();

  const handleCreateAccount = () => {
    router.push('/auth/signup');
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.heading}>
          Master skills through
          <br />
          Gamified learning <br />
          Anywhere, anytime
        </div>
        <div className={styles.description}>
          Our platform empowers educators to create dynamic courses and students to unlock their
          potential with interactive, game-based learning
        </div>
        {!currentUser && (
          <div className={styles.buttonsWrapper}>
            <div
              className={`${styles.ctaButton} ${styles.signUpButton}`}
              onClick={handleCreateAccount}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleCreateAccount();
                }
              }}
            >
              <div className={styles.buttonText}>Sign Up</div>
            </div>

            <div
              className={`${styles.ctaButton} ${styles.signInButton}`}
              onClick={handleSignIn}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSignIn();
                }
              }}
            >
              <div className={styles.signInButtonText}>Sign In</div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.imageWrapper}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 900 548"
          fill="none"
          preserveAspectRatio="xMinYMin slice"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          style={{ position: 'absolute', right: 0 }}
        >
          <path d="M69.7288 0L900 0V548H0L69.7288 0Z" fill="url(#pattern0_6505_42111)" />
          <defs>
            <pattern
              id="pattern0_6505_42111"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use
                xlinkHref="#image0_6505_42111"
                transform="matrix(0.000520833 0 0 0.00101429 0 0.00702555)"
              />
            </pattern>
            <image
              id="image0_6505_42111"
              xlinkHref={landingPageImage.bg1Image}
              width="1920"
              height="980"
            />
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default PageHeader;
