export type Example = {
  id: number;
  inputText: string;
  outputText: string;
  explanation?: string;
  img?: string;
};

// local problem data
export type Problem = {
  id: string;
  title: string;
  problemStatement: string;
  examples: Example[];
  constraints: string;
  order: number;
  starterCode: string;
  handlerFunction: unknown;
  starterFunctionName: string;
  levelId?: string;
};

export type DBProblem = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  order: number;
  videoId?: string;
  link?: string;
};
export type CodeProblemDTO = {
  id: string;
  levelId: string;
  description: string;
  parameters?: unknown[];
  returnType?: unknown;
  starterCode: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  testcases?: Array<{
    id: string;
    input: string;
    output: string;
    hidden: boolean;
  }>;
};
