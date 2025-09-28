import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Logo from '../Logo';
import Button from '../Button';
import InputField from '@/components/ui/InputField/InputField';
import GoogleSignInButton from '../GoogleSignInButton';
import { authImage } from '@/assets/images';
import Link from 'next/link';
import Image from 'next/image';
import useRequest from '@/hooks/use-request';

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate form based on current step
  useEffect(() => {
    const errors: { [key: string]: string } = {};
    if (!email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Please enter a valid email address';

    if (!password) errors.password = 'Password is required';
    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  }, [email, password]);

  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: { email, password },
    onSuccess: () => router.push('/'), // Signup complete, go to home
    onError: () => {},
  });

  const handleSigninClick = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  const handleForgotPasswordClick = () => {
    router.push('/auth/reset-password/email');
  };

  return (
    <main className="flex w-full min-h-screen bg-white max-md:flex-col">
      <section className="flex flex-col items-center justify-center p-10 w-[920px] max-md:items-center max-md:p-5 max-md:w-full max-sm:p-4 h-screen">
        <div className="flex flex-col items-center w-[400px] max-md:w-full max-md:max-w-[400px]">
          <header className="flex gap-2 items-center mb-10 w-full">
            <Logo />
          </header>

          <form className="w-full" onSubmit={handleSigninClick}>
            <InputField
              label="Email"
              type="email"
              placeholder="Enter your email"
              className="mb-9 max-sm:mb-6"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={formErrors.email}
            />

            <InputField
              label="Password"
              type="password"
              placeholder="Enter your password"
              className="mb-9 max-sm:mb-6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={formErrors.password}
            />

            <div className="flex justify-between items-center mb-12 w-full max-sm:flex-col max-sm:gap-2.5 max-sm:items-start">
              <div className="flex gap-2.5 items-center text-xs text-neutral-900">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border border-solid border-black border-opacity-30 h-[17px] w-[19px]"
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <button
                type="button"
                className="text-xs cursor-pointer text-neutral-900"
                onClick={handleForgotPasswordClick}
              >
                Forgot password
              </button>
            </div>

            {errors && errors}

            <Button variant="primary" className="mb-6" type="submit" disabled={!isFormValid}>
              Sign in
            </Button>

            <GoogleSignInButton className="mb-10" />

            <p className="text-xs text-center text-zinc-600">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-teal-500 no-underline">
                Sign up for free!
              </Link>
            </p>
          </form>
        </div>
      </section>

      <aside className="flex-1 h-screen max-md:hidden">
        <Image
          src={authImage.background}
          alt="Auth background"
          className="object-cover size-full"
          width={50000}
          height={50000}
        />
      </aside>
    </main>
  );
}

export default LoginPage;
