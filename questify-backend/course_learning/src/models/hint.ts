import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { Level } from './level';
import { v4 as uuidv4 } from 'uuid';

const HintDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  description: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
      len: [1, 255] as [number, number],
    },
  },
  price: {
    allowNull: false,
    type: DataTypes.INTEGER,
    validate: {
      notEmpty: true,
      min: 0,
    },
    defaultValue: 0,
  },
  levelId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Level,
      key: 'id',
    },
  },
};

interface HintAttributes {
  id: string;
  description: string;
  price: number;
  levelId: string;
}

type HintCreationAttributes = Optional<HintAttributes, 'id'>;

class Hint extends Model<HintAttributes, HintCreationAttributes> implements HintAttributes {
  public id!: string;
  public description!: string;
  public price!: number;
  public levelId!: string;
}

Hint.init(HintDefinition, {
  sequelize,
  tableName: 'hints',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { Hint };
