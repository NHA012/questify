import React from 'react';
import { useRouter } from 'next/router';
import Logo from '../Logo';
import Button from '../Button';
import InputField from '@/components/ui/InputField/InputField';
import { authImage } from '@/assets/images';
import Image from 'next/image';

function EmailPage() {
  const router = useRouter();

  const handleResetPasswordClick = () => {
    router.push('/auth/reset-password/password');
  };

  return (
    <main className="flex w-full min-h-screen bg-white max-md:flex-col">
      <section className="flex flex-col items-center justify-center p-10 w-[920px] max-md:items-center max-md:p-5 max-md:w-full max-sm:p-4 h-screen">
        <div className="flex flex-col items-center w-[400px] max-md:w-full max-md:max-w-[400px]">
          <header className="flex gap-2 items-center mb-10 w-full">
            <Logo />
          </header>

          <form className="w-full">
            <InputField
              label="Email"
              type="email"
              placeholder="Enter your email"
              className="mb-9 max-sm:mb-6"
            />

            <Button variant="primary" className="mb-6" onClick={handleResetPasswordClick}>
              Continue
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

export default EmailPage;
