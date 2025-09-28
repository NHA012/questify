// import { auth } from '@/features/code_problems/firebase/firebase';
import Link from 'next/link';
import React from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { useSetRecoilState } from 'recoil';
import Image from 'next/image';
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import { BsList } from 'react-icons/bs';
import Timer from '../Timer/Timer';
// import { useRouter } from 'next/router';
// import { problems } from '../../utils/problems';
// import { Problem } from '@/types/problem.type';
import { logoIcon } from '@/assets/icons';

type TopbarProps = { problemPage?: boolean };

const Topbar: React.FC<TopbarProps> = ({ problemPage }) => {
  // const [user] = useAuthState(auth);
  // useSetRecoilState(authModalState);
  // const router = useRouter();

  // const handleProblemChange = (isForward: boolean) => {
  //   const { order } = problems[router.query.pid as string] as Problem;
  //   const direction = isForward ? 1 : -1;
  //   const nextProblemOrder = order + direction;
  //   const nextProblemKey = Object.keys(problems).find(
  //     (key) => problems[key].order === nextProblemOrder,
  //   );

  //   if (isForward && !nextProblemKey) {
  //     const firstProblemKey = Object.keys(problems).find((key) => problems[key].order === 1);
  //     router.push(`/problems/${firstProblemKey}`);
  //   } else if (!isForward && !nextProblemKey) {
  //     const lastProblemKey = Object.keys(problems).find(
  //       (key) => problems[key].order === Object.keys(problems).length,
  //     );
  //     router.push(`/problems/${lastProblemKey}`);
  //   } else {
  //     router.push(`/problems/${nextProblemKey}`);
  //   }
  // };

  // const FaChevronLeftIcon = FaChevronLeft as React.ElementType;
  // const FaChevronRightIcon = FaChevronRight as React.ElementType;
  // const BsListIcon = BsList as React.ElementType;

  return (
    <nav className="relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7">
      <div
        className={`flex w-full items-center justify-between ${!problemPage ? 'max-w-[1200px] mx-auto' : ''}`}
      >
        <Link href="/" className="h-[22px] flex-1">
          <Image src={logoIcon} alt="Logo" height={100} width={30} />
        </Link>

        {/* {problemPage && (
          <div className="flex items-center gap-4 flex-1 justify-center">
            <div
              className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer"
              onClick={() => handleProblemChange(false)}
            >
              <FaChevronLeftIcon />
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 font-medium max-w-[170px] text-dark-gray-8 cursor-pointer"
            >
              <div>
                <BsListIcon />
              </div>
              <p>Problem List</p>
            </Link>
            <div
              className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer"
              onClick={() => handleProblemChange(true)}
            >
              <FaChevronRightIcon />
            </div>
          </div>
        )} */}

        <div className="flex items-center space-x-4 flex-1 justify-end">
          {problemPage && <Timer />}
        </div>
      </div>
    </nav>
  );
};
export default Topbar;
