import Topbar from '@/features/code_problems/components/Topbar/Topbar';
import Workspace from '@/features/code_problems/components/Workspace/Workspace';
import useHasMounted from '@/hooks/useHasMounted';
import React from 'react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

// type ProblemPageProps = {
//   // problem: Problem;
//   pid: string;
// };

const ProblemRoute: React.FC = () => {
  const router = useRouter();
  const { pid } = router.query;
  const [isReady, setIsReady] = useState(false);
  const hasMounted = useHasMounted();

  useEffect(() => {
    if (router.isReady) {
      setIsReady(true);
    }
  }, [router.isReady]);

  if (!hasMounted) return null;

  if (!isReady) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <Topbar problemPage />
      <Workspace pid={pid as string} />
    </div>
  );
};
export default ProblemRoute;

// fetch the local data
//  SSG
// getStaticPaths => it create the dynamic routes
// export async function getStaticPaths() {
//   const paths = Object.keys(problems).map((key) => ({
//     params: { pid: key },
//   }));

//   return {
//     paths,
//     fallback: false,
//   };
// }

// // getStaticProps => it fetch the data

// export async function getStaticProps({ params }: { params: { pid: string } }) {
//   const { pid } = params;
//   const problem = problems[pid];

//   if (!problem) {
//     return {
//       notFound: true,
//     };
//   }
//   problem.handlerFunction = problem.handlerFunction.toString();
//   return {
//     props: {
//       problem,
//     },
//   };
// }
