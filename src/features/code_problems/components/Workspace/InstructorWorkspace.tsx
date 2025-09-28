// InstructorWorkspace.tsx
import { useState, useEffect } from 'react';
import Split from 'react-split';
import ProblemDescription from '@/features/code_problems/components/Workspace/ProblemDescription/ProblemDescription';
import Submissions from '@/features/code_problems/components/Workspace/Submission/submissions';
import InstructorPlayground from './Playground/InstructorPlayground';
import { fetchCodeProblemById } from '@/services/codeProblemService';

interface CodeProblem {
  id: string;
  title: string;
  description?: string;
  starterCode: string;
  levelId?: string;
}

interface InstructorWorkspaceProps {
  pid: string;
  studentId: string;
}

const InstructorWorkspace: React.FC<InstructorWorkspaceProps> = ({ pid, studentId }) => {
  const [problem, setProblem] = useState<CodeProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'submissions'>('submissions');
  //   const [selectedSubmissionCode, setSelectedSubmissionCode] = useState<string | undefined>(
  //     undefined,
  //   );

  useEffect(() => {
    const fetchProblems = async () => {
      if (!pid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchCodeProblemById(pid);

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
  }, [pid, studentId]);

  // Handle submission selection
  //   const handleSubmissionSelect = (code: string) => {
  //     setSelectedSubmissionCode(code);
  //   };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-dark-layer-1">
        <div className="text-white">Loading problem...</div>
      </div>
    );
  }

  const renderLeftPanel = () => {
    if (activeTab === 'description') {
      return <ProblemDescription problem={problem || undefined} _solved={false} pid={pid} />;
    } else {
      // Pass a handler to the submissions component
      return (
        <Submissions
          problemId={pid}
          //   onSubmissionSelect={handleSubmissionSelect}
        />
      );
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
          Student Submissions
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
            <InstructorPlayground problem={problem} />
          ) : (
            <div className="flex justify-center items-center h-full text-white">
              Problem not found or failed to load
            </div>
          )}
        </div>
      </Split>
    </div>
  );
};

export default InstructorWorkspace;
