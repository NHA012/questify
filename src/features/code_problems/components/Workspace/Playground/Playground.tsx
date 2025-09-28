import { useState, useEffect } from 'react';
import PreferenceNav from './PreferenceNav/PreferenceNav';
import Split from 'react-split';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
// import EditorFooter from './EditorFooter';
import { BsChevronUp } from 'react-icons/bs';
import RewardModal from '@/components/common/RewardModal/RewardModal';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, firestore } from '@/features/code_problems/firebase/firebase';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
// import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import useLocalStorage from '@/hooks/useLocalStorage';
import { assessCodeProblem } from '@/services/codeProblemService';
import { fetchTestcasesByProblemId } from '@/services/codeProblemService';
import { SubmissionResponse } from '@/types/courses.type';
import { submitLevel } from '@/services/levelService';

interface CodeProblem {
  id: string;
  // levelId: string;
  title: string;
  description?: string;
  // parameters: string[];
  // returnType: Record<string, any>;
  starterCode?: string;
  // isDeleted: boolean;
  levelId?: string;
}

type PlaygroundProps = {
  problem: CodeProblem;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
}

interface TestcaseAttributes {
  id: string;
  // codeProblemId: string;
  input: string;
  output: string;
  hidden: boolean;
  // isDeleted: boolean;
}

const Playground: React.FC<PlaygroundProps> = ({
  problem = {} as CodeProblem,
  setSuccess,
  setSolved,
}) => {
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
  // Set a default empty function if starterCode is undefined
  const defaultCode = '// Your code here\n';
  const [userCode, setUserCode] = useState<string>('');
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testcases, setTestcases] = useState<TestcaseAttributes[]>([]);
  const [submissionResponse, setSubmissionResponse] = useState<SubmissionResponse | null>(null);

  const [fontSize] = useLocalStorage('lcc-fontSize', '16px');

  const [settings, setSettings] = useState<ISettings>({
    fontSize: fontSize,
    settingsModalIsOpen: false,
    dropdownIsOpen: false,
  });
  const BsChevronUpIcon = BsChevronUp as React.ElementType;
  // const [user] = useAuthState(auth);
  const user = useLocalStorage('lcc-user', null);
  // ADDED: Local storage for tracking solved problems
  const [solvedProblems, setSolvedProblems] = useLocalStorage(
    'lcc-solved-problems',
    JSON.stringify([]),
  );
  const {
    query: { pid },
  } = useRouter();

  const handleSubmit = async () => {
    if (isSubmitting || !problem?.id) return;

    try {
      setIsSubmitting(true);

      // Ensure we're using the right part of the code
      // const codeToSubmit = userCode.slice(userCode.indexOf(problem.starterFunctionName));
      const codeToSubmit = userCode.slice(
        userCode.indexOf('function main(') !== -1 ? userCode.indexOf('function main(') : 0,
      );

      // Use the existing assessCodeProblem service with an empty context
      const assessmentResult = await assessCodeProblem(problem.id, codeToSubmit);

      if (assessmentResult.success) {
        // All test cases passed
        setSuccess(true);

        if (problem.levelId) {
          const data = await submitLevel(problem.levelId);
          setSubmissionResponse(data);
          setIsRewardModalOpen(true);
        }

        setTimeout(() => {
          setSuccess(false);
        }, 4000);

        // Update solved problems
        if (user && pid && !solvedProblems.includes(pid)) {
          const updatedSolvedProblems = [...solvedProblems, pid];
          setSolvedProblems(JSON.stringify(updatedSolvedProblems));
        }

        setSolved(true);
      } else {
        // Show failure message with details
        const failedTests = assessmentResult.results.filter((result) => !result.passed);
        if (failedTests.length > 0) {
          const errorMessage = `Test failed: ${failedTests[0].input} → Expected: ${failedTests[0].expectedOutput}, Got: ${failedTests[0].actualOutput || 'undefined'}`;
          toast.error(errorMessage, {
            position: 'top-center',
            autoClose: 5000,
            theme: 'dark',
          });
        } else {
          toast.error('One or more test cases failed', {
            position: 'top-center',
            autoClose: 3000,
            theme: 'dark',
          });
        }
      }
    } catch (error) {
      console.error('Error submitting code:', error);
      toast.error(
        error instanceof Error ? error.message : 'An error occurred while submitting your code',
        {
          position: 'top-center',
          autoClose: 3000,
          theme: 'dark',
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Simulate fetching data with a timeout to mimic network request
    const fetchTestcases = async () => {
      if (!problem?.id) return;

      try {
        const response = await fetchTestcasesByProblemId(problem.id);
        setTestcases(response);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    fetchTestcases();
  }, [problem?.id]);

  useEffect(() => {
    // Initialize userCode from local storage or from problem.starterCode
    const initializeCode = () => {
      if (pid) {
        const savedCode = localStorage.getItem(`code-${pid}`);
        if (savedCode) {
          try {
            setUserCode(JSON.parse(savedCode));
            return;
          } catch (e) {
            console.error('Error parsing saved code:', e);
          }
        }
      }

      // If no saved code or parsing error, use starterCode or default
      setUserCode(problem?.starterCode || defaultCode);
    };

    initializeCode();
  }, [pid, problem]);

  const onChange = (value: string) => {
    setUserCode(value);
    if (pid) {
      localStorage.setItem(`code-${pid}`, JSON.stringify(value));
    }
  };

  const handleCloseRewardModal = () => {
    setIsRewardModalOpen(false);
  };

  // Loading state instead of failing
  if (!problem?.id) {
    return <div className="flex justify-center items-center h-full">Loading problem...</div>;
  }

  return (
    <div className="flex flex-col bg-dark-layer-1 relative overflow-x-hidden">
      <PreferenceNav settings={settings} setSettings={setSettings} />

      <Split className="h-[calc(100vh-94px)]" direction="vertical" sizes={[60, 40]} minSize={60}>
        <div className="w-full overflow-auto">
          <CodeMirror
            value={userCode}
            theme={vscodeDark}
            onChange={onChange}
            extensions={[javascript()]}
            style={{ fontSize: settings.fontSize }}
          />
        </div>
        <div className="w-full px-5 overflow-auto">
          {/* testcase heading */}
          <div className="flex h-10 items-center space-x-6">
            <div className="relative flex h-full flex-col justify-center cursor-pointer">
              <div className="text-sm font-medium leading-5 text-white">Testcases</div>
              <hr className="absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white" />
            </div>
          </div>

          <div className="flex">
            {testcases.map((example, index) => (
              <div
                className="mr-2 items-start mt-2 "
                key={example.id}
                onClick={() => setActiveTestCaseId(index)}
              >
                <div className="flex flex-wrap items-center gap-y-4">
                  <div
                    className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
										${activeTestCaseId === index ? 'text-white' : 'text-gray-500'}
									`}
                  >
                    Case {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="font-semibold my-4">
            <p className="text-sm font-medium mt-4 text-white">Input:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              {testcases[activeTestCaseId]?.input || ''}
            </div>
            <p className="text-sm font-medium mt-4 text-white">Output:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              {testcases[activeTestCaseId]?.output || ''}
            </div>
          </div>
        </div>
      </Split>
      {/* <EditorFooter handleSubmit={handleSubmit} /> */}
      <div className="flex bg-dark-layer-1 absolute bottom-0 z-10 w-full">
        <div className="mx-5 my-[10px] flex justify-between w-full">
          <div className="mr-2 flex flex-1 flex-nowrap items-center space-x-4">
            <button className="px-3 py-1.5 font-medium items-center transition-all inline-flex bg-dark-fill-3 text-sm hover:bg-dark-fill-2 text-dark-label-2 rounded-lg pl-3 pr-2">
              Console
              <div className="ml-1 transform transition flex items-center">
                <BsChevronUpIcon className="fill-gray-6 mx-1 fill-dark-gray-6" />
              </div>
            </button>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <button
              className="px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex text-sm text-white bg-dark-green-s hover:bg-green-3 rounded-lg"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      {isRewardModalOpen && submissionResponse && (
        <RewardModal
          progress={50}
          achievements={[
            {
              id: 'level-complete',
              description: 'Level Completed!',
              rewards: [
                { type: 'xp', amount: submissionResponse.exp, icon: 'xp' },
                { type: 'gems', amount: submissionResponse.gold, icon: 'gems' },
                { type: 'point', amount: submissionResponse.point, icon: 'point' },
              ],
            },
            {
              id: 'quiz-bonus',
              description: 'Bonus!',
              rewards: [
                { type: 'xp', amount: submissionResponse.bonusExp, icon: 'xp' },
                { type: 'gems', amount: submissionResponse.bonusGold, icon: 'gems' },
              ],
            },
          ]}
          onClose={handleCloseRewardModal}
        />
      )}
    </div>
  );
};
export default Playground;
