import { CodeProblem } from '../code-problem';
import { Testcase } from '../testcase';
import { Level } from '../level';

const defineCodeProblemAssociations = () => {
  CodeProblem.belongsTo(Level, { foreignKey: 'levelId' });
  CodeProblem.hasMany(Testcase, { foreignKey: 'codeProblemId' });
};

export default defineCodeProblemAssociations;
