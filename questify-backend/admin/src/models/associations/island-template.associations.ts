import { IslandTemplate } from '../island-template';
import { AdminIslandTemplate } from '../admin-island-template';
import { User } from '../user';

const defineIslandTemplateAssociations = () => {
  IslandTemplate.hasMany(AdminIslandTemplate, {
    foreignKey: 'islandTemplateId',
    as: 'adminActions',
  });

  IslandTemplate.belongsToMany(User, {
    through: AdminIslandTemplate,
    foreignKey: 'islandTemplateId',
    otherKey: 'adminId',
    as: 'admins',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default defineIslandTemplateAssociations;
