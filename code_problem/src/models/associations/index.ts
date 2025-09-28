import defineLevelAssociations from './level.associations';
import defineTestcaseAssociations from './testcase.associations';
import defineUserAssociations from './user.associations';
import defineAttemptAssociations from './attempt.associations';
import defineCodeProblemAssociations from './code-problem.associations';
import defineUserLevelAssociations from './user-level.associations';

export const defineAssociations = () => {
  defineLevelAssociations();
  defineTestcaseAssociations();
  defineUserAssociations();
  defineAttemptAssociations();
  defineCodeProblemAssociations();
  defineUserLevelAssociations();
};

defineAssociations();
