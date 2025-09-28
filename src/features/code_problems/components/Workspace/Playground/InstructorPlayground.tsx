// InstructorPlayground.tsx
import { useState, useEffect } from 'react';
import PreferenceNav from '@/features/code_problems/components/Workspace/Playground/PreferenceNav/PreferenceNav';
import Split from 'react-split';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import { BsChevronUp } from 'react-icons/bs';
import { fetchTestcasesByProblemId } from '@/services/codeProblemService';
import useLocalStorage from '@/hooks/useLocalStorage';

interface CodeProblem {
  id: string;
  title: string;
  description?: string;
  starterCode?: string;
  levelId?: string;
}

type InstructorPlaygroundProps = {
  problem: CodeProblem;
  submissionCode?: string;
};

export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
}

interface TestcaseAttributes {
  id: string;
  input: string;
  output: string;
  hidden: boolean;
}

const InstructorPlayground: React.FC<InstructorPlaygroundProps> = ({ problem, submissionCode }) => {
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
  const defaultCode = '// Your code here\n';
  const [code, setCode] = useState<string>(submissionCode || problem?.starterCode || defaultCode);
  const [testcases, setTestcases] = useState<TestcaseAttributes[]>([]);
  const BsChevronUpIcon = BsChevronUp as React.ElementType;

  const [fontSize] = useLocalStorage('lcc-fontSize', '16px');
  const [settings, setSettings] = useState<ISettings>({
    fontSize: fontSize,
    settingsModalIsOpen: false,
    dropdownIsOpen: false,
  });

  useEffect(() => {
    // Fetch testcases for the problem
    const fetchTestcases = async () => {
      if (!problem?.id) return;

      try {
        const response = await fetchTestcasesByProblemId(problem.id);
        setTestcases(response);
      } catch (error) {
        console.error('Error fetching testcases:', error);
      }
    };

    fetchTestcases();
  }, [problem?.id]);

  useEffect(() => {
    // Update code when submissionCode changes
    if (submissionCode) {
      setCode(submissionCode);
    } else {
      setCode(problem?.starterCode || defaultCode);
    }
  }, [submissionCode, problem?.starterCode]);

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
            value={code}
            theme={vscodeDark}
            extensions={[javascript()]}
            style={{ fontSize: settings.fontSize }}
            readOnly={true}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightActiveLine: true,
              foldGutter: true,
            }}
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

      {/* Instructor Info Bar instead of submit button */}
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
            <div className="px-3 py-1.5 font-medium items-center inline-flex bg-dark-fill-3 text-sm text-dark-label-2 rounded-lg">
              Instructor View
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorPlayground;
