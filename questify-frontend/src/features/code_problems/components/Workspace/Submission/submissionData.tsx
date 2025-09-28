export interface FeedbackAttributes {
  id: string;
  message: string;
  teacherId: string;
  attemptId: string;
}

export interface CodeSubmission {
  id: string;
  userId: string;
  answer: string;
  status: 'Accepted' | 'Wrong Answer';
  finishedAt: Date;
  point?: number;
  feedback?: FeedbackAttributes;
}

const codeSamples = [
  `function main(nums, target) {
  const numMap = {};
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (complement in numMap) {
      return [numMap[complement], i];
    }
    
    numMap[nums[i]] = i;
  }
  
  return [];
}`,
  `function main(nums, target) {
  // Brute force approach
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}`,
  `function main(nums, target) {
  // Wrong implementation that returns first two elements
  return [0, 1];
}`,
  `function main(nums, target) {
  // This solution has a bug that causes it to miss some cases
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    const complementIndex = nums.indexOf(complement);
    if (complementIndex !== -1 && complementIndex !== i) {
      return [i, complementIndex];
    }
  }
  return [];
}`,
];

const feedbackData: FeedbackAttributes[] = [
  {
    id: 'fb-1a2b3c4d-5e6f-7g8h',
    message:
      'Excellent solution! Your use of a hash map gives us O(n) time complexity which is optimal for this problem.',
    teacherId: 'teacher-1',
    attemptId: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
  },
  {
    id: 'fb-2b3c4d5e-6f7g-8h9i',
    message:
      'This approach works but has O(n²) time complexity. Try to think about how you could improve the efficiency using a hash map.',
    teacherId: 'teacher-1',
    attemptId: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
  },
  {
    id: 'fb-3c4d5e6f-7g8h-9i0j',
    message:
      'Your solution is incorrect. Remember that you need to find the indices of two numbers that add up to the target, not just return [0, 1] for every input.',
    teacherId: 'teacher-2',
    attemptId: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
  },
  {
    id: 'fb-5e6f7g8h-9i0j-1k2l',
    message:
      'Perfect implementation! You have shown great understanding of hash maps and their application to this problem.',
    teacherId: 'teacher-1',
    attemptId: '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
  },
];

const getFeedbackForAttempt = (attemptId: string): FeedbackAttributes | undefined => {
  return feedbackData.find((feedback) => feedback.attemptId === attemptId);
};

const twoSumSubmissions: CodeSubmission[] = [
  {
    id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    userId: 'current-user-id',
    answer: codeSamples[0],
    status: 'Accepted',
    finishedAt: new Date('2025-05-18T12:06:00'),
    point: 82,
    feedback: getFeedbackForAttempt('1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'),
  },
  {
    id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    userId: 'current-user-id',
    answer: codeSamples[1],
    status: 'Wrong Answer',
    finishedAt: new Date('2025-05-18T11:51:00'),
    point: 0,
    feedback: getFeedbackForAttempt('2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q'),
  },
  {
    id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    userId: 'current-user-id',
    answer: codeSamples[2],
    status: 'Wrong Answer',
    finishedAt: new Date('2025-05-18T11:36:00'),
    point: 0,
    feedback: getFeedbackForAttempt('3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r'),
  },
  {
    id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    userId: 'current-user-id',
    answer: codeSamples[3],
    status: 'Wrong Answer',
    finishedAt: new Date('2025-05-18T11:21:00'),
    point: 0,
  },
  {
    id: '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
    userId: 'current-user-id',
    answer: codeSamples[0],
    status: 'Accepted',
    finishedAt: new Date('2025-05-18T11:06:00'),
    point: 99,
    feedback: getFeedbackForAttempt('5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t'),
  },
];

const defaultSubmissions = [...twoSumSubmissions];

export const mockSubmissions: Record<string, CodeSubmission[]> = {
  'two-sum': twoSumSubmissions,
  default: defaultSubmissions,
};

export const getSubmissionsForProblem = (problemId: string): CodeSubmission[] => {
  return mockSubmissions[problemId] || mockSubmissions['default'];
};
