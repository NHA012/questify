import { AdminUser } from '../admin-user';
import { User } from '../user';

const defineAdminUserAssociations = () => {
  AdminUser.belongsTo(User, {
    foreignKey: 'adminId',
    as: 'admin',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  AdminUser.belongsTo(User, {
    foreignKey: 'userId',
    as: 'targetUser',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default defineAdminUserAssociations;
