import { SlideType } from '@datn242/questify-common';

export type ContentType = 'code_problem' | 'challenge';
export type InputVariableType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'matrix';

export interface Example {
  inputText: string;
  outputText: string;
  explanation: string;
}

export interface InputVariable {
  name: string;
  type: InputVariableType;
}

export interface Testcase {
  id: string;
  input: string;
  output: string;
  isValid?: boolean;
  validationError?: string;
  hidden: boolean;
}

export interface CodeProblem {
  id: string;
  title: string;
  description: string;
  starterCode?: string;
  Testcases: Testcase[];
}

export interface PrerequisiteIsland {
  id: string;
  name: string;
}

export interface Answer {
  content: string;
  isCorrect: boolean;
}

export interface Slide {
  id: string;
  title: string;
  description: string;
  slideNumber: number;
  type: SlideType;
  imageUrl: string | null;
  videoUrl: string | null;
  answers: Answer[] | null;
  challengeId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Challenge {
  id: string;
  levelId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  Slides: Slide[];
  Level: Level;
  courseId?: string;
}

export interface Level {
  id: string;
  name: string;
  description: string;
  position?: number;
  islandId?: string;
  contentType?: ContentType;
  CodeProblem?: CodeProblem;
  challenge?: Challenge;
}

export interface Island {
  id: string;
  name: string;
  description?: string;
  position: number;
  backgroundImage?: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  Levels: Level[];
  prerequisites: PrerequisiteIsland[];
  prerequisiteIslandIds?: string[];
}

export interface ApiResponse {
  islands: Island[];
}

export interface SubmissionResponse {
  userId: string;
  levelId: string;
  gold: number;
  exp: number;
  point: number;
  bonusGold: number;
  bonusExp: number;
}
