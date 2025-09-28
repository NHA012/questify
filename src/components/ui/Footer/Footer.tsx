import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  logoIcon,
  facebookIcon,
  instagramIcon,
  linkedinIcon,
  twitterIcon,
  youtubeIcon,
} from '@/assets/icons';
import style from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={`${style.footer} w-full bg-black py-0 px-0`}>
      <div className={style.footer__center}>
        <div className="flex items-center gap-2">
          <Image src={logoIcon} alt="Questify Logo" width={32} height={32} className="w-8 h-8" />
          <span className="text-xl font-semibold text-white">Questify</span>
        </div>

        <div className={`text-sm ${style.footer__links}`}>
          Contact:{' '}
          <Link href="/" className={`hover:text-white ${style.footer__links}`}>
            support@questify.io
          </Link>
        </div>

        <div className="flex gap-4 mb-5">
          <Link href="/">
            <Image
              src={facebookIcon}
              alt="Facebook Logo"
              width={46}
              height={46}
              className={`mx-1 ${style.footer__logo}`}
            />
          </Link>
          <Link href="/">
            <Image
              src={instagramIcon}
              alt="Instagram Logo"
              width={46}
              height={46}
              className={`mx-1 ${style.footer__logo}`}
            />
          </Link>
          <Link href="/">
            <Image
              src={linkedinIcon}
              alt="Linkedin Logo"
              width={46}
              height={46}
              className={`mx-1 ${style.footer__logo}`}
            />
          </Link>
          <Link href="https://discord.gg/ZGxZe75b">
            <Image
              src={twitterIcon}
              alt="Twitter Logo"
              width={46}
              height={46}
              className={`mx-1 ${style.footer__logo}`}
            />
          </Link>
          <Link href="/">
            <Image
              src={youtubeIcon}
              alt="Youtube Logo"
              width={46}
              height={46}
              className={`mx-1 ${style.footer__logo}`}
            />
          </Link>
        </div>

        <hr className={style.footer__divider} />

        <div className={style.footer__copyright}>
          <p className="text-sm" style={{ color: '#8C94A3' }}>
            © 2024 - Questify. All rights reserved
          </p>
          <div className={style.footer__select}>
            <select defaultValue="english" className={style.footer__select}>
              <option value="english">English</option>
              <option value="vietnamese">Vietnamese</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
