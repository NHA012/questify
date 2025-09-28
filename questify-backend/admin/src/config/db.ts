import { Sequelize } from 'sequelize';
import { EnvStage } from '@datn242/questify-common';

let sequelize: Sequelize;

if (process.env.NODE_ENV === EnvStage.Prod || process.env.NODE_ENV === EnvStage.Dev) {
  if (!process.env.POSTGRES_URI) {
    throw new Error('POSTGRES_URI must be defined');
  }
  sequelize = new Sequelize(process.env.POSTGRES_URI, {
    logging: false,
  });
} else if (process.env.NODE_ENV === EnvStage.Test) {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
} else {
  throw new Error(
    `Invalid or undefined NODE_ENV: "${process.env.NODE_ENV}". Expected one of: ${Object.values(EnvStage).join(', ')}`,
  );
}

const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to Admin SRV Postgres');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

const closeDbConnection = async () => {
  try {
    await sequelize.close();
    console.log('Admin SRV | Database connection closed.');
  } catch (err) {
    console.error('Error closing database connection:', err);
  }
};

export { sequelize, connectDb, closeDbConnection };
