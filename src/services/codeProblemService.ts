import axios from 'axios';
import { ResourcePrefix } from '@datn242/questify-common';
import { Problem } from '@/types/problem.type';

// Interface matching your backend CodeProblem model structure
export interface CodeProblemDTO {
  id: string;
  title: string;
  levelId: string;
  description: string;
  parameters?: unknown[];
  returnType?: unknown;
  starterCode: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  Testcases?: Array<{
    id: string;
    input: string;
    output: string;
    hidden: boolean;
  }>;
}

/**
 * Transforms backend code problem data to frontend Problem format
 */
const transformCodeProblemData = (dto: CodeProblemDTO): Problem => {
  // Extract examples from visible testcases
  const examples =
    dto.Testcases?.filter((testcase) => !testcase.hidden).map((testcase, index) => ({
      id: index,
      inputText: testcase.input,
      outputText: testcase.output,
    })) || [];

  return {
    id: dto.id,
    title: dto.title,
    problemStatement: dto.description,
    examples,
    constraints: '', // Can be extracted from description if structured properly
    starterCode: dto.starterCode,
    starterFunctionName: extractFunctionName(dto.starterCode),
    order: 0,
    // Create a handler that always returns true since we'll use the backend for assessment
    handlerFunction: function () {
      return true;
    },
    levelId: dto.levelId,
  };
};

/**
 * Extract the function name from the starter code
 */
function extractFunctionName(code: string): string {
  // Find "function name(" pattern
  const match = code.match(/function\s+([a-zA-Z0-9_$]+)\s*\(/);
  if (match && match[1]) {
    return `function ${match[1]}(`;
  }
  return 'function main(';
}

export const fetchCodeProblemById = async (codeProblemId: string) => {
  try {
    const response = await axios.get(ResourcePrefix.CodeProblem + '/' + codeProblemId);
    console.log('code problem', response.data);
    return transformCodeProblemData(response.data);
  } catch (error) {
    console.error('Error fetching code problem:', error);
    throw error;
  }
};

export interface AssessmentResult {
  success: boolean;
  results: {
    input: string;
    expectedOutput: string;
    actualOutput?: string;
    error?: string;
    passed: boolean;
    hidden: boolean;
  }[];
  totalTestcases: number;
  passedTestcases: number;
}

export const assessCodeProblem = async (
  id: string,
  userCode: string,
): Promise<AssessmentResult> => {
  try {
    const response = await axios.post(ResourcePrefix.CodeProblem + `/${id}/assessment`, {
      userCode,
    });
    return response.data;
  } catch (error) {
    console.error('Error assessing code problem:', error);
    throw error;
  }
};

export const getAllCodeProblems = async () => {
  try {
    const response = await axios.get(ResourcePrefix.CodeProblem);
    return response.data;
  } catch (error) {
    console.error('Error fetching code problems:', error);
    throw error;
  }
};

export const fetchTestcasesByProblemId = async (codeProblemId: string) => {
  try {
    const response = await axios.get(ResourcePrefix.CodeProblem + `/${codeProblemId}/testcases`);
    return response.data;
  } catch (error) {
    console.error('Error fetching code problems:', error);
    throw error;
  }
};
