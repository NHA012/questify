import { AdminIslandTemplate } from '../admin-island-template';
import { User } from '../user';
import { IslandTemplate } from '../island-template';

const defineAdminIslandTemplateAssociations = () => {
  AdminIslandTemplate.belongsTo(User, {
    foreignKey: 'adminId',
    as: 'admin',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  AdminIslandTemplate.belongsTo(IslandTemplate, {
    foreignKey: 'islandTemplateId',
    as: 'islandTemplate',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default defineAdminIslandTemplateAssociations;
