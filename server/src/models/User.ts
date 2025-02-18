import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface IUserAttributes {
  id: number;
  name: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserCreationAttributes extends Optional<IUserAttributes, "id" | "createdAt" | "updatedAt"> {}

class User extends Model<IUserAttributes, IUserCreationAttributes> implements IUserAttributes {
  public id!: number;
  public name!: string;
  public passwordHash!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "Users",
    timestamps: true,
  }
);

export default User;
