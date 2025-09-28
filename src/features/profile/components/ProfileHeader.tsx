import React from 'react';
import Image from 'next/image';
import styles from '../Profile.module.css';
import { lecturesIcon } from '@/assets/icons';

interface ProfileHeaderProps {
  photoUrl: string;
  username: string;
  email: string;
  title: string;
  coursesCount: number;
  settingPage?: boolean;
  onEditProfile: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  photoUrl,
  username,
  email,
  title,
  coursesCount,
  settingPage = false,
  onEditProfile,
}) => {
  return (
    <section className="mb-16">
      <div className="flex gap-12 items-start h-[200px]  max-md:flex-col max-md:gap-8 max-md:items-center">
        <Image
          src={photoUrl}
          className="object-cover rounded-full h-[200px] w-[200px]"
          alt="Photo"
          width={50000}
          height={50000}
        />
        <div className="flex flex-col justify-center h-full">
          <h1 className="mb-3 text-3xl font-semibold text-neutral-800">{username}</h1>
          <h2 className="mb-3 text-xl">{email}</h2>
          <p className="mb-3 text-base text-gray-500">{title}</p>
          <div className="flex gap-1.5 items-center">
            <Image src={lecturesIcon} alt="" height={24} width={24} />
            <span className="text-sm text-gray-500 font-semibold">{coursesCount} courses</span>
          </div>
        </div>
        {!settingPage && (
          <button className={styles.editProfile} onClick={onEditProfile} aria-label="Edit Profile">
            Edit Profile
          </button>
        )}
      </div>
    </section>
  );
};

export default ProfileHeader;
