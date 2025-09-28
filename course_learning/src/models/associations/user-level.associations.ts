import { User } from '../user';
import { Level } from '../level';
import { UserLevel } from '../user-level';

const defineUserLevelAssociations = () => {
  UserLevel.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  UserLevel.belongsTo(Level, {
    foreignKey: 'levelId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default defineUserLevelAssociations;
