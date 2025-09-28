import React, { useState, useEffect } from 'react';
import { getSubmissionsForProblem, CodeSubmission } from './submissionData';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';

interface SubmissionsProps {
  problemId?: string;
  studentId?: string;
}

const formatTimeForDisplay = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

const Submissions: React.FC<SubmissionsProps> = ({ problemId = 'default', studentId = null }) => {
  const [submissions, setSubmissions] = useState<CodeSubmission[]>([]);
  const [expandedSubmissionIds, setExpandedSubmissionIds] = useState<Set<string>>(new Set());
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchedSubmissions = getSubmissionsForProblem(problemId);
    setSubmissions(fetchedSubmissions);

    if (fetchedSubmissions.length > 0) {
      setSelectedSubmissionId(fetchedSubmissions[0].id);
    }
  }, [problemId, studentId]);

  const handleSubmissionClick = (submissionId: string) => {
    setSelectedSubmissionId(submissionId);

    setExpandedSubmissionIds((prevIds) => {
      const newIds = new Set(prevIds);
      if (newIds.has(submissionId)) {
        newIds.delete(submissionId);
      } else {
        newIds.add(submissionId);
      }
      return newIds;
    });
  };

  const isSubmissionExpanded = (submissionId: string): boolean => {
    return expandedSubmissionIds.has(submissionId);
  };

  return (
    <div className="bg-dark-layer-1 h-full overflow-auto">
      <div className="px-5 py-4">
        <h2 className="text-white text-xl font-medium mb-4">Submissions</h2>

        {submissions.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-gray-400">
            No submissions yet
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className={`
                  bg-dark-layer-2 rounded-lg overflow-hidden
                  ${selectedSubmissionId === submission.id ? 'border-2 border-blue-500' : 'border border-dark-fill-3'}
                `}
              >
                <div
                  className="p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => handleSubmissionClick(submission.id)}
                >
                  <div className="flex items-center">
                    <div
                      className={`font-medium ${submission.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {submission.status}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {submission.point > 0 && (
                      <div className="text-yellow-500 font-medium">+{submission.point} points</div>
                    )}
                    <div className="text-gray-400 text-sm">
                      {formatTimeForDisplay(submission.finishedAt)}
                    </div>
                    <button
                      className="px-2 py-1 bg-dark-fill-3 rounded hover:bg-dark-fill-2 text-white text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(submission.answer);
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {isSubmissionExpanded(submission.id) && (
                  <>
                    <div className="border-t border-dark-fill-3">
                      <CodeMirror
                        value={submission.answer}
                        theme={vscodeDark}
                        extensions={[javascript()]}
                        style={{ fontSize: '16px' }}
                        readOnly={true}
                        basicSetup={{
                          lineNumbers: true,
                          highlightActiveLineGutter: true,
                          highlightActiveLine: true,
                          foldGutter: true,
                        }}
                      />
                    </div>

                    {submission.feedback && (
                      <div className="p-4 border-t border-dark-fill-3 bg-dark-layer-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">
                              T
                            </div>
                          </div>
                          <div>
                            <h4 className="text-white text-sm font-medium mb-1">
                              Teacher Feedback:
                            </h4>
                            <p className="text-gray-300 text-sm">{submission.feedback.message}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Submissions;
