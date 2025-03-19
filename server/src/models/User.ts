import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";
import Resume from "./Resume.js";

export interface IUser extends Model {
  id: string;
  username: string;
  passwordhash: string;
  created_at?: Date;
  updated_at?: Date;
  role: string;
}

const User = sequelize.define<IUser>(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    passwordhash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "user",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: true,
  }
);

User.hasMany(Resume, { foreignKey: "user_id", onDelete: "CASCADE" });

export default User;
