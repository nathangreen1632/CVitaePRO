import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class User extends Model {
  public id!: string;
  public username!: string;
  public email!: string;
  public password!: string;
}

User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    tableName: 'users',
  }
);
