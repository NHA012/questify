import React from 'react';
import { useRouter } from 'next/router';
import Logo from '../Logo';
import Button from '../Button';
import PasswordInput from '../PasswordInput';
import { authImage } from '@/assets/images';
import Image from 'next/image';

function PasswordPage() {
  const router = useRouter();

  const handleResetPasswordClick = () => {
    router.push('/auth/login');
  };

  return (
    <main className="flex w-full min-h-screen bg-white max-md:flex-col">
      <section className="flex flex-col items-center justify-center p-10 w-[920px] max-md:items-center max-md:p-5 max-md:w-full max-sm:p-4 h-screen">
        <div className="flex flex-col items-center w-[400px] max-md:w-full max-md:max-w-[400px]">
          <header className="flex gap-2 items-center mb-10 w-full">
            <Logo />
          </header>

          <form className="w-full">
            <PasswordInput label="Password" placeholder="Create password" className="mb-3" />
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm password"
              className="mb-5"
            />

            <Button variant="primary" className="mb-6" onClick={handleResetPasswordClick}>
              Change Password
            </Button>
          </form>
        </div>
      </section>

      <aside className="flex-1 h-screen max-md:hidden">
        <Image
          src={authImage.background}
          alt="Auth Background"
          className="object-cover size-full"
          width={50000}
          height={50000}
        />
      </aside>
    </main>
  );
}

export default PasswordPage;
