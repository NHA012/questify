import { Problem } from '@/types/problem.type';
import { fetchCodeProblemById } from '@/services/codeProblemService';
import React, { useEffect, useState } from 'react';
import { BsCheck2Circle } from 'react-icons/bs';
import MarkdownRenderer from './MarkdownRenderer';

interface CodeProblem {
  id: string;
  // levelId: string;
  title: string;
  description?: string;
  // parameters: string[];
  // returnType: Record<string, any>;
  starterCode: string;
  // isDeleted: boolean;
}

type ProblemDescriptionProps = { problem: CodeProblem; _solved: boolean; pid: string };

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem, _solved, pid }) => {
  // const { currentProblem, loading, problemDifficultyClass, setCurrentProblem } =
  //   useGetCurrentProblem(problem.id);
  const [additionalProblem, setAdditionalProblem] = useState<Problem | null>(null);
  // const { liked, disliked, solved, setData, starred } = useGetUsersDataOnProblem(problem.id);

  useEffect(() => {
    const getAdditionalProblem = async () => {
      try {
        const data = await fetchCodeProblemById(pid);
        setAdditionalProblem(data);
      } catch (error) {
        console.error('Error fetching additional problem:', error);
      }
    };
    getAdditionalProblem();
  }, [pid]);

  useEffect(() => {
    if (additionalProblem) {
      console.log('Additional problem:', additionalProblem);
    }
  }, [additionalProblem]);

  const BsCheck2CircleIcon = BsCheck2Circle as React.ElementType;

  return (
    <div className="bg-dark-layer-1">
      <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
        <div className="px-5">
          {/* Problem heading */}
          <div className="w-full">
            <div className="flex space-x-4">
              <div className="flex-1 mr-2 text-lg text-white font-medium">{problem?.title}</div>
            </div>
            {problem && (
              <div className="flex items-center mt-3">
                {_solved && (
                  <div className="rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s">
                    <BsCheck2CircleIcon />
                  </div>
                )}
              </div>
            )}

            {/* {loading && (
              <div className="mt-3 flex space-x-2">
                <RectangleSkeleton />
                <CircleSkeleton />
                <RectangleSkeleton />
                <RectangleSkeleton />
                <CircleSkeleton />
              </div>
            )} */}

            {/* Problem Statement(paragraphs) */}
            <div className="text-white text-sm">
              <MarkdownRenderer
                markdownContent={additionalProblem?.problemStatement.replace(/\n/g, '\n\n')}
              />
            </div>

            {/* Examples */}
            {/* <div className="mt-4">
              {problem.examples.map((example, index) => (
                <div key={example.id}>
                  <p className="font-medium text-white ">Example {index + 1}: </p>
                  {example.img && (
                    <Image src={example.img} alt="" className="mt-3" width={500} height={300} />
                  )}
                  <div className="example-card">
                    <pre>
                      <strong className="text-white">Input: </strong> {example.inputText}
                      <br />
                      <strong>Output:</strong>
                      {example.outputText} <br />
                      {example.explanation && (
                        <>
                          <strong>Explanation:</strong> {example.explanation}
                        </>
                      )}
                    </pre>
                  </div>
                </div>
              ))}
            </div> */}

            {/* Constraints */}
            {/* <div className="my-8 pb-4">
              <div className="text-white text-sm font-medium">Constraints:</div>
              <ul className="text-white ml-5 list-disc ">
                <div dangerouslySetInnerHTML={{ __html: problem.constraints }} />
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProblemDescription;

// function useGetCurrentProblem(problemId: string) {
//   const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [problemDifficultyClass, setProblemDifficultyClass] = useState<string>('');

//   useEffect(() => {
//     // Get problem from DB
//     const getCurrentProblem = async () => {
//       setLoading(true);
//       const docRef = doc(firestore, 'problems', problemId);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const problem = docSnap.data();
//         setCurrentProblem({ id: docSnap.id, ...problem } as DBProblem);
//         // easy, medium, hard
//         setProblemDifficultyClass(
//           problem.difficulty === 'Easy'
//             ? 'bg-olive text-olive'
//             : problem.difficulty === 'Medium'
//               ? 'bg-dark-yellow text-dark-yellow'
//               : ' bg-dark-pink text-dark-pink',
//         );
//       }
//       setLoading(false);
//     };
//     getCurrentProblem();
//   }, [problemId]);

//   return { currentProblem, loading, problemDifficultyClass, setCurrentProblem };
// }

// function useGetUsersDataOnProblem(problemId: string) {
//   const [data, setData] = useState({
//     liked: false,
//     disliked: false,
//     starred: false,
//     solved: false,
//   });
//   const [user] = useAuthState(auth);

//   useEffect(() => {
//     const getUsersDataOnProblem = async () => {
//       const userRef = doc(firestore, 'users', user!.uid);
//       const userSnap = await getDoc(userRef);
//       if (userSnap.exists()) {
//         const data = userSnap.data();
//         const { solvedProblems, likedProblems, dislikedProblems, starredProblems } = data;
//         setData({
//           liked: likedProblems.includes(problemId), // likedProblems["two-sum","jump-game"]
//           disliked: dislikedProblems.includes(problemId),
//           starred: starredProblems.includes(problemId),
//           solved: solvedProblems.includes(problemId),
//         });
//       }
//     };

//     if (user) getUsersDataOnProblem();
//     return () => setData({ liked: false, disliked: false, starred: false, solved: false });
//   }, [problemId, user]);

//   return { ...data, setData };
// }
