import { useState, useEffect } from 'react';
import Split from 'react-split';
import ProblemDescription from './ProblemDescription/ProblemDescription';
import Playground from './Playground/Playground';
import Submissions from './Submission/submissions';
import Confetti from 'react-confetti';
import useWindowSize from '@/hooks/useWindowSize';
import { fetchCodeProblemById } from '@/services/codeProblemService';

interface CodeProblem {
  id: string;
  title: string;
  description?: string;
  starterCode: string;
  levelId?: string;
}

const Workspace: React.FC<{ pid?: string }> = ({ pid = null }) => {
  const { width, height } = useWindowSize();
  const [success, setSuccess] = useState(false);
  const [solved, setSolved] = useState(false);
  const [problem, setProblem] = useState<CodeProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'submissions'>('description');

  useEffect(() => {
    const fetchProblems = async () => {
      if (!pid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchCodeProblemById(pid);
        console.log('response', response);

        // Ensure we have the expected data structure with required fields
        if (response && response.id) {
          // Set default starterCode if it's missing
          if (!response.starterCode) {
            response.starterCode = '// Your code here';
          }
          setProblem(response);
        } else {
          console.error('Invalid problem data received:', response);
        }
      } catch (err) {
        console.error('Failed to fetch code problem:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [pid]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-dark-layer-1">
        <div className="text-white">Loading problem...</div>
      </div>
    );
  }

  const renderLeftPanel = () => {
    if (activeTab === 'description') {
      return <ProblemDescription problem={problem || undefined} _solved={solved} pid={pid || ''} />;
    } else {
      return <Submissions problemId={pid || 'default'} />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
        <div
          className={`px-5 py-[10px] text-xs cursor-pointer ${activeTab === 'description' ? 'bg-dark-layer-1 rounded-t-[5px]' : ''}`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </div>
        <div
          className={`px-5 py-[10px] text-xs cursor-pointer ${activeTab === 'submissions' ? 'bg-dark-layer-1 rounded-t-[5px]' : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          Submissions
        </div>
      </div>

      <Split
        className="split h-[calc(100vh-40px)]"
        minSize={0}
        sizes={[40, 60]}
        direction="horizontal"
        gutterSize={4}
      >
        <div className="bg-dark-layer-1 overflow-auto">{renderLeftPanel()}</div>
        <div className="bg-dark-fill-2">
          {problem ? (
            <Playground problem={problem} setSuccess={setSuccess} setSolved={setSolved} />
          ) : (
            <div className="flex justify-center items-center h-full text-white">
              Problem not found or failed to load
            </div>
          )}
          {success && (
            <Confetti gravity={0.3} tweenDuration={4000} width={width - 1} height={height - 1} />
          )}
        </div>
      </Split>
    </div>
  );
};

export default Workspace;
