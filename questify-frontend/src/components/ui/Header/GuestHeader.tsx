import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cartIcon, logoIcon, searchIcon } from '@/assets/icons';
import style from './Header.module.css';
import { useRouter } from 'next/router';

const GuestHeader: React.FC = () => {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  const handleCreateAccount = () => {
    router.push('/auth/signup');
  };

  return (
    <div className="border-b border-F5F7FA">
      <div className={`${style.navbar1} bg-black text-white py-0`}>
        <div className={style.navbar__container}>
          <div className={`${style.navbar__linksContainer} flex`}>
            <Link href="/" className={style.navbar__linksCurrent}>
              Home
            </Link>
            <Link href="/courses" className={style.navbar__links}>
              Courses
            </Link>
          </div>
          <div className={`${style.navbar__linksContainer} flex`}>
            <select className={style.navbar__select}>
              <option>USD</option>
              <option>VND</option>
            </select>
            <select className={style.navbar__select}>
              <option>English</option>
              <option>Vietnamese</option>
            </select>
          </div>
        </div>
      </div>
      <div className={`${style.navbar2} w-full ${style.navbar__container}`}>
        <div className="flex">
          <Link href="/" className={`flex ${style.navbar__name}`}>
            <Image src={logoIcon} alt="Questify Logo" width={32} height={32} className="w-8 h-8" />
            <span className={style.navbar__brand}>Questify</span>
          </Link>
        </div>
        <div className={`flex ${style.search__container}`}>
          <div className={style.navbar__searchContainer}>
            <Image src={searchIcon} alt="Search" width={32} height={32} />
            <input
              type="text"
              placeholder="What do you want to learn?"
              className={style.navbar__searchInput}
            />
          </div>
        </div>
        <div className={`flex ${style.navbar__icons}`}>
          <Image src={cartIcon} alt="Cart" className={style.cart} width={100} height={100} />
          <button
            className={`${style.ctaButton} ${style.signUpButton}`}
            onClick={handleCreateAccount}
          >
            <span className={style.signUpButtonText}>Sign Up</span>
          </button>
          <button className={`${style.ctaButton} ${style.signInButton}`} onClick={handleSignIn}>
            <span className={style.signInButtonText}>Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestHeader;
