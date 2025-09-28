import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { BsCheckCircle } from 'react-icons/bs';
import { AiFillYoutube } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { getAllCodeProblems } from '@/services/codeProblemService';
import YouTube from 'react-youtube';
// import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
// import { auth, firestore } from '@/features/code_problems/firebase/firebase';
import { DBProblem } from '@/types/problem.type';
// import { useAuthState } from 'react-firebase-hooks/auth';
import useLocalStorage from '@/hooks/useLocalStorage';
const FEIN_VIDEO_ID = 'B9synWjqBn8';
type ProblemsTableProps = { setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>> };

const mockProblems: DBProblem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Array',
    order: 1,
    videoId: 'XYQo-lKjJyg',
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    category: 'Linked List',
    order: 2,
    videoId: '',
  },
  {
    id: 'jump-game',
    title: 'Jump Game',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    order: 3,
    videoId: 'Yan0cv2cLy8',
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    order: 4,
    videoId: 'WTzjTskDFMg',
  },
  {
    id: 'search-a-2d-matrix',
    title: 'Search a 2D Matrix',
    difficulty: 'Medium',
    category: 'Binary Search',
    order: 5,
    videoId: '',
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    category: 'Two Pointers',
    order: 6,
    videoId: '',
  },
];

const ProblemsTable: React.FC<ProblemsTableProps> = ({ setLoadingProblems }) => {
  const [youtubePlayer, setYoutubePlayer] = useState({ isOpen: false, videoId: '' });
  const problems = useGetProblems(setLoadingProblems);
  const solvedProblems = useGetSolvedProblems();
  console.log('solvedProblems', solvedProblems);
  const closeModal = () => {
    setYoutubePlayer({ isOpen: false, videoId: '' });
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);

    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const BsCheckCircleIcon = BsCheckCircle as React.ElementType;
  const AiFillYoutubeIcon = AiFillYoutube as React.ElementType;
  const IoCloseIcon = IoClose as React.ElementType;

  return (
    <>
      <tbody className="text-white">
        {problems.map((problem, idx) => {
          const difficulyColor =
            problem.difficulty === 'Easy'
              ? 'text-dark-green-s'
              : problem.difficulty === 'Medium'
                ? 'text-dark-yellow'
                : 'text-dark-pink';
          return (
            <tr className={`${idx % 2 == 1 ? 'bg-dark-layer-1' : ''}`} key={problem.id}>
              <th className="px-2 py-4 font-medium whitespace-nowrap text-dark-green-s">
                {solvedProblems.includes(problem.id) && (
                  <BsCheckCircleIcon fontSize={'18'} width="18" />
                )}
              </th>
              <td className="px-6 py-4">
                {problem.link ? (
                  <Link
                    href={problem.link}
                    className="hover:text-blue-600 cursor-pointer"
                    target="_blank"
                  >
                    {problem.title}
                  </Link>
                ) : (
                  <Link
                    className="hover:text-blue-600 cursor-pointer"
                    href={`/problems/${problem.id}`}
                  >
                    {problem.title}
                  </Link>
                )}
              </td>
              <td className={`px-6 py-4 ${difficulyColor}`}>{problem.difficulty}</td>
              <td className={'px-6 py-4'}>{problem.category}</td>
              <td className={'px-6 py-4'}>
                {problem.videoId ? (
                  <AiFillYoutubeIcon
                    fontSize={'28'}
                    className="cursor-pointer hover:text-red-600"
                    onClick={() =>
                      setYoutubePlayer({ isOpen: true, videoId: problem.videoId as string })
                    }
                  />
                ) : (
                  <p className="text-gray-400">Coming soon</p>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
      {youtubePlayer.isOpen && (
        <tfoot className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center">
          <div
            className="bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute"
            onClick={closeModal}
          ></div>
          <div className="w-full z-50 h-full px-6 relative max-w-4xl">
            <div className="w-full h-full flex items-center justify-center relative">
              <div className="w-full relative">
                <IoCloseIcon
                  fontSize={'35'}
                  className="cursor-pointer absolute -top-16 right-0"
                  onClick={closeModal}
                />
                <YouTube
                  videoId={FEIN_VIDEO_ID} //todo: replace FEIN_VIDEO_ID with youtubePlayer.videoId later
                  loading="lazy"
                  iframeClassName="w-full min-h-[500px]"
                />
              </div>
            </div>
          </div>
        </tfoot>
      )}
    </>
  );
};
export default ProblemsTable;

function useGetProblems(setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>) {
  const [problems, setProblems] = useState<DBProblem[]>([]);

  useEffect(() => {
    // Simulate fetching data with a timeout to mimic network request
    setLoadingProblems(true);

    // You could either store this data in a JSON file and import it
    // or fetch it from a local API endpoint if you implement one
    const fetchProblems = async () => {
      // Simulate network delay
      try {
        // Call the API function instead of using mock data
        const response = await getAllCodeProblems();

        // Transform the API response to match the DBProblem type
        const formattedProblems: DBProblem[] = response.map((problem: DBProblem) => ({
          id: problem.id,
          title: problem.title || `Problem ${problem.id}`,
          difficulty: problem.difficulty || 'Medium', // Set a default if API doesn't provide
          category: problem.category || 'Sliding Window', // Set a default if API doesn't provide
          order: problem.order || 1,
          videoId: problem.videoId || '',
          link: problem.link || '',
        }));

        setProblems(formattedProblems);
      } catch (error) {
        console.error('Error fetching problems:', error);
        // Fallback to mock data in case of error
        setProblems(mockProblems);
      } finally {
        setLoadingProblems(false);
      }
    };

    fetchProblems();
  }, [setLoadingProblems]);

  return problems;
}

function useGetSolvedProblems() {
  const solvedProblems = useLocalStorage('lcc-solved-problems', JSON.stringify([]));
  const [user] = useLocalStorage('lcc-user', null);

  // useEffect(() => {
  //   const getSolvedProblems = async () => {
  //     const userRef = doc(firestore, 'users', user!.uid);
  //     const userDoc = await getDoc(userRef);

  //     if (userDoc.exists()) {
  //       setSolvedProblems(userDoc.data().solvedProblems);
  //     }
  //   };

  //   if (user) getSolvedProblems();
  //   if (!user) setSolvedProblems([]);
  // }, [user]);

  return user ? solvedProblems : [];
}
