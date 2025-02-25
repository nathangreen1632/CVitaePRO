import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database.js";

interface IUserAttributes {
  id: number;
  username: string;
  passwordHash: string; // ✅ Store only hashed password
  createdAt: Date;
  updatedAt: Date;
}

interface IUserCreationAttributes extends Optional<IUserAttributes, "id" | "createdAt" | "updatedAt"> {}

class User extends Model<IUserAttributes, IUserCreationAttributes> implements IUserAttributes {
  public id!: number;
  public username!: string;
  public passwordHash!: string; // ✅ Keep only passwordHash
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
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {  // ✅ Ensure this column exists in PostgreSQL
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
    tableName: "users", // ✅ Ensure lowercase table name
    timestamps: true,
  }
);


export default User;
