import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notificationIcon, favoritesIcon, cartIcon, logoIcon, searchIcon } from '@/assets/icons';
import style from './Header.module.css';
import AvatarDropdown from './AvatarDropdown';
import { getUserProfile } from '@/services/auth.srv';

const Header: React.FC<{ currentUser; setCurrentUser }> = ({ currentUser, setCurrentUser }) => {
  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      if (response && response.currentUser) {
        setCurrentUser({
          ...response.currentUser,
          levelInfo: response.levelInfo,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
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
          <Image
            src={notificationIcon}
            alt="Notification"
            className={style.notification}
            width={32}
            height={32}
          />
          <Image
            src={favoritesIcon}
            alt="Favorites"
            className={style.favorites}
            width={32}
            height={32}
          />
          <Image src={cartIcon} alt="Cart" className={style.cart} width={32} height={32} />
          <AvatarDropdown
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            fetchUserProfile={fetchUserProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
