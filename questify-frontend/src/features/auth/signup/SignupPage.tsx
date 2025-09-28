import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import InputField from '@/components/ui/InputField/InputField';
import PasswordInput from '../PasswordInput';
import Logo from '../Logo';
import Button from '../Button';
import GoogleSignInButton from '../GoogleSignInButton';
import ArrowIcon from './ArrowIcon';
import { authImage } from '@/assets/images';
import Image from 'next/image';
import useRequest from '@/hooks/use-request';

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const passwordConditions = [
    { test: (password: string) => password.length >= 8, message: 'At least 8 characters' },
    {
      test: (password: string) => /(?=.*[a-z])/.test(password),
      message: 'At least one lowercase letter',
    },
    {
      test: (password: string) => /(?=.*[A-Z])/.test(password),
      message: 'At least one uppercase letter',
    },
    { test: (password: string) => /(?=.*\d)/.test(password), message: 'At least one number' },
    {
      test: (password: string) => /(?=.*[!@#$%^&*])/.test(password),
      message: 'At least one special character',
    },
  ];

  const PasswordValidationList: React.FC<{ password: string }> = ({ password }) => (
    <ul className="text-sm list-disc pl-5">
      {passwordConditions.map((condition, index) => (
        <li
          key={index}
          className={`mb-1 ${condition.test(password) ? 'text-green-500' : 'text-red-500'}`}
        >
          {condition.message}
        </li>
      ))}
    </ul>
  );

  // Validate form based on current step
  useEffect(() => {
    const errors: { [key: string]: string } = {};

    if (step === 'email') {
      if (!email) errors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Please enter a valid email address';

      if (!userName) errors.userName = 'Username is required';
      else if (userName.length < 3) errors.userName = 'Username must be at least 3 characters long';
      else if (!/^[a-zA-Z0-9_]+$/.test(userName))
        errors.userName = 'Username can only contain letters, numbers, and underscores';
    }

    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  }, [email, userName, password, confirmedPassword, step]);

  // API request for validating email/username
  const { doRequest: validateCredentials, errors: emailErrors } = useRequest({
    url: '/api/users/validate-credentials',
    method: 'post',
    body: { email, userName },
    onSuccess: () => setStep('password'), // Move to password step
    onError: () => {},
  });

  // API request for completing signup
  const { doRequest: completeSignup, errors: passwordErrors } = useRequest({
    url: '/api/users/complete-signup',
    method: 'post',
    body: { password, confirmedPassword },
    onSuccess: () => router.push('/'), // Signup complete, go to home
    onError: (err) => {
      if (err.response?.status === 404) {
        setStep('email'); // If session is invalid, go back to email step
      }
    },
  });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isFormValid) {
      if (step === 'email') {
        await validateCredentials();
      } else {
        await completeSignup();
      }
    }
  };

  return (
    <main className="flex w-full min-h-screen bg-white max-md:flex-col">
      <section className="relative flex-1 max-w-[1000px] max-md:hidden">
        <Image
          src={authImage.background}
          className="object-cover size-full"
          alt="Auth background"
          width={50000}
          height={50000}
        />
      </section>

      <section className="flex flex-1 justify-center items-center p-10 max-md:p-5">
        <div className="w-[648px] max-md:w-full">
          <header className="flex gap-2 items-center mb-10 w-full">
            <Logo />
          </header>

          <form className="flex flex-col" onSubmit={onSubmit}>
            {step === 'email' ? (
              <>
                <InputField
                  type="email"
                  placeholder="Email address"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={formErrors.email}
                  className="mb-4"
                />
                <InputField
                  type="text"
                  placeholder="Username"
                  label="Username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  error={formErrors.userName}
                  className="mb-4"
                />
                {emailErrors}
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!isFormValid}
                  className="flex items-center mb-4 px-6 py-0 h-12 text-base font-bold leading-10 text-white bg-teal-500 cursor-pointer border-[none] max-sm:w-full justify-center"
                >
                  Continue
                  <ArrowIcon className="ml-3" />
                </Button>
              </>
            ) : (
              <>
                <PasswordInput
                  label="Password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={formErrors.password}
                  className="mb-1"
                />
                <PasswordValidationList password={password} />
                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm password"
                  value={confirmedPassword}
                  onChange={(e) => setConfirmedPassword(e.target.value)}
                  error={formErrors.confirmedPassword}
                  className="mb-4 mt-3"
                />
                {passwordErrors}
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!isFormValid}
                  className="flex items-center mb-4 px-6 py-0 h-12 text-base font-bold leading-10 text-white bg-teal-500 cursor-pointer border-[none] max-sm:w-full justify-center"
                >
                  Create account
                  <ArrowIcon className="ml-3" />
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setStep('email')}
                  className="flex items-center mb-4 px-6 py-0 h-12 text-base font-bold leading-10 text-teal-500 bg-transparent border border-teal-500 max-sm:w-full justify-center"
                >
                  Back
                </Button>
              </>
            )}
            <GoogleSignInButton className="mb-10" />
          </form>
        </div>
      </section>
    </main>
  );
};

export default SignupPage;
