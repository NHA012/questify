import { sequelize } from '../config/db';
import { EnvStage } from '@datn242/questify-common';
import '../models/associations';

const syncModels = async () => {
  if (process.env.NODE_ENV === EnvStage.Dev) {
    console.log('⚙️ Admin SRV | Running sync in development mode...');
    try {
      await sequelize.sync({ alter: true });
      console.log('Database synced successfully');
    } catch (error) {
      console.error('Error syncing database:', error);
    }
  } else if (process.env.NODE_ENV === EnvStage.Prod) {
    console.log('🚀 Admin SRV | Production mode detected. Use migrations instead.');
    // TODO: implement migrations for production later. Temporary use force for dev
    try {
      await sequelize.sync({ alter: true });
      console.log('Database synced successfully');
    } catch (error) {
      console.error('Error syncing database:', error);
    }
  }
};

export { syncModels };
