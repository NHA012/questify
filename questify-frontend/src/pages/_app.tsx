import '@/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { logoIcon } from '@/assets/icons';
import buildClient from '@/api/build-client';
import { useRouter } from 'next/router';
import Header from '@/components/ui/Header/Header';
import Footer from '@/components/ui/Footer/Footer';
import { UserRole } from '@datn242/questify-common';

const publicRoutes = ['/', '/courses', '/course-detail', '/course/[courseId]'];
interface UserPayload {
  id: string;
  email: string;
  userName: string;
  role: UserRole;
}

type CustomAppProps = AppProps & {
  initialCurrentUser?: UserPayload;
};

const App = ({ Component, pageProps, initialCurrentUser }: CustomAppProps) => {
  const router = useRouter();
  const isAuthPage = router.pathname.startsWith('/auth');

  const [currentUser, setCurrentUser] = useState<UserPayload | null | undefined>(
    initialCurrentUser,
  );

  useEffect(() => {
    // Client-side authentication check on initial load
    const checkCurrentUser = async () => {
      try {
        const client = buildClient({ req: undefined });
        const { data } = await client.get('/api/users/currentuser');
        setCurrentUser(data.currentUser);
      } catch {
        setCurrentUser(null);
      }
    };

    if (initialCurrentUser === undefined) {
      checkCurrentUser();
    }
  }, [initialCurrentUser]);

  useEffect(() => {
    const handleRouteChange = () => {
      const checkCurrentUser = async () => {
        try {
          const client = buildClient({ req: undefined });
          const { data } = await client.get('/api/users/currentuser');
          setCurrentUser(data.currentUser);
        } catch {
          setCurrentUser(null);
        }
      };
      checkCurrentUser();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    const isPublic = publicRoutes.includes(router.pathname) || router.pathname.startsWith('/auth');

    // only redirect if route exists (i.e., not 404) and not public
    const isKnownRoute = router.route !== '/404';

    // Role-based access control
    const isAdminRoute = router.pathname.startsWith('/admin');
    const isInstructorRoute = router.pathname.startsWith('/instructor');

    // Check if user has proper role for restricted routes
    const hasInvalidRole =
      (isAdminRoute && currentUser?.role !== UserRole.Admin) ||
      (isInstructorRoute && currentUser?.role !== UserRole.Teacher);

    if ((currentUser === null && !isPublic && isKnownRoute) || (currentUser && hasInvalidRole)) {
      router.replace('/');
    }
  }, [currentUser, router]);

  if (
    (currentUser === null &&
      !publicRoutes.includes(router.pathname) &&
      !router.pathname.startsWith('/auth') &&
      router.route !== '/404') ||
    (currentUser && router.pathname.startsWith('/admin') && currentUser.role !== UserRole.Admin) ||
    (currentUser &&
      router.pathname.startsWith('/instructor') &&
      currentUser.role !== UserRole.Teacher)
  ) {
    return null; // Prevent rendering anything before redirect
  }

  return (
    <RecoilRoot>
      <Head>
        <title>Questify</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={logoIcon} />
        <meta
          name="description"
          content="Web application that contains leetcode problems and video solutions"
        />
      </Head>
      <ToastContainer />
      {!isAuthPage && <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />}
      <Component currentUser={currentUser} {...pageProps} />
      {!isAuthPage && <Footer />}
    </RecoilRoot>
  );
};

export default App;
