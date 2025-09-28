export const twoSum = {
  mockTestcase: {
    testcases: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        hidden: false,
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        hidden: false,
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
        hidden: true,
      },
    ],
  },
  mockUserCode: `function twoSum(nums, target) {
    const numMap = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = (target - nums[i])*test(0);

        if (numMap.has(complement)) {
            return [numMap.get(complement), i];
        }

        numMap.set(nums[i], i);
    }

    // If no solution is found (though the prompt says there will always be one)
    
    return [];
}

function test(a){
  return a+1;
}`,
};

export const jumpGame = {
  mockTestcase: {
    testcases: [
      {
        input: 'nums = [2,3,1,1,4]',
        output: 'true',
        hidden: false,
      },
      {
        input: 'nums = [3,2,1,0,4]',
        output: 'false',
        hidden: false,
      },
    ],
  },
  mockUserCode: `function canJump(nums) {
    let maxReach = 0;

    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
        if (maxReach >= nums.length - 1) return true;
    }

    return false;
}`,
};

export const validParentheses = {
  mockTestcase: {
    testcases: [
      {
        input: 's = "()"',
        output: 'true',
        hidden: false,
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
        hidden: false,
      },
      {
        input: 's = "(]"',
        output: 'false',
        hidden: false,
      },
      {
        input: 's = "([)]"',
        output: 'false',
        hidden: false,
      },
      {
        input: 's = "{[]}"',
        output: 'true',
        hidden: false,
      },
      {
        input: 's = "{"',
        output: 'false',
        hidden: false,
      },
      {
        input: 's = "}"',
        output: 'false',
        hidden: false,
      },
      {
        input: 's = "([{}])"',
        output: 'true',
        hidden: false,
      },
      {
        input: 's = "([{}][]){}"',
        output: 'true',
        hidden: false,
      },
    ],
  },
  mockUserCode: `function validParentheses(s) {
      const stack = [];
    const map = {
        '(': ')',
        '{': '}',
        '[': ']'
    };

    for (let char of s) {
        if (map[char]) {
            stack.push(char);
        } else {
            const top = stack.pop();
            if (map[top] !== char) {
                return false;
            }
        }
    }
    return stack.length === 0;
};`,
};

export const searchA2DMatrix = {
  mockTestcase: {
    testcases: [
      {
        input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3',
        output: 'true',
        hidden: false,
      },
      {
        input: 'matrix = [ [1,3,5,7], [10,11,16,20], [23,30,34,60] ], target = 13',
        output: 'false',
        hidden: false,
      },
      {
        input: 'matrix = [[1]], target = 1',
        output: 'true',
        hidden: false,
      },
    ],
  },
  mockUserCode: `function searchMatrix(matrix, target) {
    if (matrix.length === 0 || matrix[0].length === 0) return false;

    let rows = matrix.length;
    let cols = matrix[0].length;

    let left = 0;
    let right = rows * cols - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        let midValue = matrix[Math.floor(mid / cols)][mid % cols];

        if (midValue === target) return true;
        else if (midValue < target) left = mid + 1;
        else right = mid - 1;
    }

    return false;
}`,
};
