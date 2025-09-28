import { Testcase } from '../testcase';
import { CodeProblem } from '../code-problem';

const defineTestcaseAssociations = () => {
  Testcase.belongsTo(CodeProblem, { foreignKey: 'codeProblemId' });
};

export default defineTestcaseAssociations;
