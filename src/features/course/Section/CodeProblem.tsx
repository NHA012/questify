import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { X, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { TrashIcon } from './Icons';
import styles from './Section.module.css';

import EditorContainer from './EditorContainer';
import useRequest from '@/hooks/use-request';
import { Level, CodeProblem as CodeProblemType, Testcase } from '@/types/courses.type';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import InputField from '@/components/ui/InputField/InputField';

interface CodeProblemModalProps {
  level: Level;
  onClose: () => void;
  onSave: () => void;
}

interface EditorContainerRef {
  setContent: (content: string) => void;
  getContent: () => string;
}

export default function CodeProblem({ level, onClose, onSave }: CodeProblemModalProps) {
  const [codeProblemData, setCodeProblemData] = useState<CodeProblemType>(() => {
    if (level.CodeProblem) {
      return {
        id: level.CodeProblem.id || '',
        title: level.CodeProblem.title || '',
        description: level.CodeProblem.description || '',
        starterCode: level.CodeProblem.starterCode || '// Your code here',
        Testcases:
          level.CodeProblem.Testcases && level.CodeProblem.Testcases.length > 0
            ? level.CodeProblem.Testcases.map((tc) => ({
                id: tc.id || '',
                input: tc.input || '',
                output: tc.output || '',
                hidden: tc.hidden === undefined ? false : tc.hidden,
                isValid: true,
                validationError: undefined,
              }))
            : [{ id: '', input: '', output: '', hidden: false, isValid: true }],
      };
    }
    return {
      id: '',
      title: '',
      description: '',
      starterCode: '// Your code here',
      Testcases: [{ id: '', input: '', output: '', hidden: false, isValid: true }],
    };
  });

  const validateInput = (input: string): { isValid: boolean; error?: string } => {
    if (!input.trim()) {
      return { isValid: false, error: 'Input is empty' };
    }

    const inputPattern =
      /^(\s*[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*[\[\]\{\}"'0-9a-zA-Z,\s._-]+\s*,?\s*)*$/;
    if (inputPattern.test(input)) {
      return { isValid: true };
    }

    try {
      JSON.parse(input);
      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Invalid input format' };
    }
  };

  const generateExampleInput = () => {
    return 'nums = [2,7,11,15], target = 9';
  };

  const handleStarterCodeChange = (starterCode: string) => {
    setCodeProblemData((prev) => ({
      ...prev,
      starterCode,
    }));
  };

  const handleTitleChange = (title: string) => {
    setCodeProblemData((prev) => ({
      ...prev,
      title,
    }));
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [originalTestcases, setOriginalTestcases] = useState<Testcase[]>([]);

  const editorRef = useRef<EditorContainerRef>(null);

  const { doRequest: fetchCodeProblem } = useRequest({
    url: `/api/code-problem/level/${level.id}`,
    method: 'get',
    onSuccess: (data) => {
      console.log('Code problem fetched successfully:', data);
      const problem = data.CodeProblem || data;

      const testcases =
        problem.Testcases && Array.isArray(problem.Testcases) && problem.Testcases.length > 0
          ? problem.Testcases.map((tc) => ({
              id: tc.id || '',
              input: tc.input || '',
              output: tc.output || '',
              hidden: tc.hidden === undefined ? false : tc.hidden,
              isValid: true,
              validationError: undefined,
            }))
          : [{ id: '', input: '', output: '', hidden: false, isValid: true }];

      setCodeProblemData({
        id: problem.id || '',
        title: problem.title || '',
        description: problem.description || '',
        starterCode: problem.starterCode || '// Your code here',
        Testcases: testcases,
      });

      if (editorRef.current && problem.description) {
        editorRef.current.setContent(problem.description);
      }

      setOriginalTestcases(testcases);
    },
    onError: (error) => {
      console.error('Error fetching code problem:', error);
      setErrorMessage(error?.message || 'Failed to fetch code problem');
    },
  });

  const fetchCodeProblemRef = useRef(fetchCodeProblem);

  useEffect(() => {
    if (level.id && level.contentType === 'code_problem') {
      fetchCodeProblemRef.current(level.id);
    }
  }, [level.id, level.contentType]);

  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (codeProblemData.description && !isInitialLoad.current && editorRef.current) {
      editorRef.current.setContent(codeProblemData.description);
    }
    if (codeProblemData.description) {
      isInitialLoad.current = false;
    }
  }, [codeProblemData.description]);

  const { doRequest: createCodeProblem, errors: createErrors } = useRequest({
    url: `/api/code-problem`,
    method: 'post',
    body: {},
    onSuccess: (data) => {
      console.log('Code problem created successfully:', data);
      onSave();
    },
    onError: (error) => {
      console.error('Error creating code problem:', error);
      setErrorMessage(error?.message || 'Failed to create code problem');
    },
  });

  const { doRequest: updateCodeProblem, errors: updateErrors } = useRequest({
    url: '',
    method: 'patch',
    body: {},
    onSuccess: (data) => {
      console.log('Code problem updated successfully:', data);
      onSave();
    },
    onError: (error) => {
      console.error('Error updating code problem:', error);
      setErrorMessage(error?.message || 'Failed to update code problem');
    },
  });

  // Handle updating individual testcases
  const { doRequest: updateTestcase, errors: testcaseErrors } = useRequest({
    url: '',
    method: 'patch',
    body: {},
    onSuccess: (data) => {
      console.log('Testcase updated successfully:', data);
    },
    onError: (error) => {
      console.error('Error updating testcase:', error);
      setErrorMessage(error?.message || 'Failed to update testcase');
    },
  });

  // Handle creating new testcases
  const { doRequest: createTestcase, errors: createTestcaseErrors } = useRequest({
    url: '',
    method: 'post',
    body: {},
    onSuccess: (data) => {
      console.log('Testcase created successfully:', data);
    },
    onError: (error) => {
      console.error('Error creating testcase:', error);
      setErrorMessage(error?.message || 'Failed to create testcase');
    },
  });

  const { doRequest: deleteTestcase, errors: deleteTestcaseErrors } = useRequest({
    url: '',
    method: 'delete',
    body: {},
    onSuccess: (data) => {
      console.log('Testcase deleted successfully:', data);
    },
    onError: (error) => {
      console.error('Error deleting testcase:', error);
      setErrorMessage(error?.message || 'Failed to delete testcase');
    },
  });

  const handleDescriptionChange = (description: string) => {
    setCodeProblemData((prev) => ({
      ...prev,
      description,
    }));
  };

  const handleTestcaseChange = (index: number, field: keyof Testcase, value: string | boolean) => {
    setCodeProblemData((prev) => {
      // Ensure Testcases exists and is an array
      if (!prev.Testcases || !Array.isArray(prev.Testcases)) {
        const newTestcases = [{ id: '', input: '', output: '', hidden: false, isValid: true }];
        return { ...prev, Testcases: newTestcases };
      }

      const newTestcases = [...prev.Testcases];
      if (!newTestcases[index]) {
        newTestcases[index] = { id: '', input: '', output: '', hidden: false, isValid: true };
      }

      newTestcases[index] = { ...newTestcases[index], [field]: value };

      if (field === 'input' && typeof value === 'string') {
        const validation = validateInput(value);
        newTestcases[index].isValid = validation.isValid;
        newTestcases[index].validationError = validation.error;
      }
      return { ...prev, Testcases: newTestcases };
    });
  };

  const addTestcase = () => {
    setCodeProblemData((prev) => {
      // Ensure Testcases exists and is an array
      const currentTestcases =
        prev.Testcases && Array.isArray(prev.Testcases) ? [...prev.Testcases] : [];

      return {
        ...prev,
        Testcases: [
          ...currentTestcases,
          { id: '', input: '', output: '', hidden: false, isValid: true },
        ],
      };
    });
  };

  const removeTestcase = (index: number) => {
    setCodeProblemData((prev) => {
      // Ensure Testcases exists and is an array
      if (!prev.Testcases || !Array.isArray(prev.Testcases)) {
        return {
          ...prev,
          Testcases: [{ id: '', input: '', output: '', hidden: false, isValid: true }],
        };
      }

      return {
        ...prev,
        Testcases: prev.Testcases.filter((_, i) => i !== index),
      };
    });
  };

  const applyExampleInput = (testcaseIndex: number) => {
    const exampleInput = generateExampleInput();
    handleTestcaseChange(testcaseIndex, 'input', exampleInput);
  };

  const saveChanges = async () => {
    // Ensure we have valid test cases
    if (!codeProblemData.Testcases || !Array.isArray(codeProblemData.Testcases)) {
      setErrorMessage('No valid test cases found');
      return;
    }

    const isEditing = !!codeProblemData.id;
    const hasInvalidInputs = codeProblemData.Testcases.some(
      (testcase) => testcase.input.trim() !== '' && testcase.isValid === false,
    );
    if (hasInvalidInputs) {
      alert('Please fix the invalid inputs and outputs before saving');
      return;
    }

    if (isEditing) {
      await updateCodeProblem({
        url: `/api/code-problem/${codeProblemData.id}`,
        method: 'patch',
        body: {
          title: codeProblemData.title,
          description: codeProblemData.description,
          starterCode: codeProblemData.starterCode,
          level_id: level.id,
        },
      });

      for (const testcase of codeProblemData.Testcases) {
        // Skip empty testcases for updating
        if (testcase.input.trim() === '' || testcase.output.trim() === '') {
          continue;
        }

        if (testcase.id) {
          await updateTestcase({
            url: `/api/code-problem/${codeProblemData.id}/testcases/${testcase.id}`,
            method: 'patch',
            body: {
              input: testcase.input,
              output: testcase.output,
              hidden: testcase.hidden,
            },
          });
        } else {
          await createTestcase({
            url: `/api/code-problem/${codeProblemData.id}/testcases`,
            method: 'post',
            body: {
              input: testcase.input,
              output: testcase.output,
              hidden: testcase.hidden,
            },
          });
        }
      }

      if (originalTestcases && Array.isArray(originalTestcases)) {
        for (const originalTestcase of originalTestcases) {
          if (
            originalTestcase.id &&
            !codeProblemData.Testcases.some((tc) => tc.id === originalTestcase.id)
          ) {
            await deleteTestcase({
              url: `/api/code-problem/${codeProblemData.id}/testcases/${originalTestcase.id}`,
              method: 'delete',
              body: {},
            });
          }
        }
      }
    } else {
      const validTestcases = codeProblemData.Testcases.filter(
        (testcase) => testcase.input.trim() !== '' && testcase.output.trim() !== '',
      );

      await createCodeProblem({
        url: `/api/code-problem/`,
        method: 'post',
        body: {
          level_id: level.id,
          title: codeProblemData.title,
          description: codeProblemData.description,
          starterCode: codeProblemData.starterCode,
          testcases: validTestcases.map((testcase) => ({
            input: testcase.input,
            output: testcase.output,
            hidden: testcase.hidden,
          })),
        },
      });
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalLarge}>
        <div className={styles.modalHeader}>
          <h2>{codeProblemData.id ? 'Edit' : 'Create'} Code Problem</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalContent}>
          {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
          {(createErrors ||
            updateErrors ||
            testcaseErrors ||
            createTestcaseErrors ||
            deleteTestcaseErrors) && (
            <div className={styles.errorMessage}>
              {createErrors ||
                updateErrors ||
                testcaseErrors ||
                createTestcaseErrors ||
                deleteTestcaseErrors}
            </div>
          )}

          <InputField
            label="Title *"
            type="text"
            placeholder="Enter Code Problem Title"
            value={codeProblemData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="mb-9 max-sm:mb-6"
          />

          <EditorContainer
            ref={editorRef}
            initialValue={codeProblemData.description}
            onContentChange={handleDescriptionChange}
          />

          <div className={styles.formGroup}>
            <label>Starter Code</label>
            <div
              className={styles.codeEditorContainer}
              style={{ maxHeight: '400px', overflow: 'auto' }}
            >
              <CodeMirror
                value={codeProblemData.starterCode}
                theme={vscodeDark}
                onChange={handleStarterCodeChange}
                extensions={[javascript()]}
                className={styles.codeEditor}
                height="auto"
                style={{ overflow: 'visible' }}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.sectionHeader}>
              <label>Test Cases</label>
              <button type="button" className={styles.addButton} onClick={addTestcase}>
                <Plus size={16} /> Add Test Case
              </button>
            </div>

            {codeProblemData.Testcases &&
              Array.isArray(codeProblemData.Testcases) &&
              codeProblemData.Testcases.map((testcase, index) => (
                <div key={index} className={styles.exampleContainer}>
                  <div className={styles.exampleHeader}>
                    <h4>Test Case {index + 1}</h4>
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeTestcase(index)}
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <div className={styles.formGroup}>
                        <label>Input</label>
                        <button
                          type="button"
                          className={styles.exampleButton}
                          onClick={() => applyExampleInput(index)}
                        >
                          Generate Example
                        </button>
                        <textarea
                          placeholder="Enter input like: nums = [2,7,11,15], target = 9"
                          value={testcase.input}
                          onChange={(e) => handleTestcaseChange(index, 'input', e.target.value)}
                          className={`${styles.textarea} ${testcase.input && testcase.isValid === false ? styles.invalidInput : ''}`}
                          rows={3}
                        />
                        <div className={styles.inputHelp}>
                          <small>
                            Format: variable = value pairs. Example: nums = [2,7,11,15], target = 9
                          </small>
                        </div>

                        {testcase.input && (
                          <div
                            className={`${styles.validationFeedback} ${testcase.isValid ? styles.valid : styles.invalid}`}
                          >
                            {testcase.isValid ? (
                              <span className={styles.validMessage}>
                                <CheckCircle size={14} /> Valid input format
                              </span>
                            ) : (
                              <span className={styles.invalidMessage}>
                                <AlertCircle size={14} /> {testcase.validationError}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.formColumn}>
                      <div className={styles.formGroup}>
                        <label>Expected Output</label>
                        <textarea
                          placeholder="Enter expected output"
                          value={testcase.output}
                          onChange={(e) => handleTestcaseChange(index, 'output', e.target.value)}
                          className={`${styles.textarea} mt-[18px]`}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <label>
                    <input
                      type="checkbox"
                      checked={testcase.hidden}
                      onChange={(e) => handleTestcaseChange(index, 'hidden', e.target.checked)}
                    />{' '}
                    Show this test case
                  </label>
                </div>
              ))}
          </div>

          <div className={styles.modalFooter}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button className={styles.saveButton} onClick={saveChanges}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
