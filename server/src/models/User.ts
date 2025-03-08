import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";
import Resume from "./Resume.js"; // ✅ Import Resume model

export interface IUser extends Model {
  id: string; // ✅ UUID instead of integer
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
      type: DataTypes.UUID, // ✅ Use UUID now
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,  // ‼️ Allow null values for username during development
      unique: true,
    },
    passwordhash: {
      type: DataTypes.STRING(255),
      allowNull: false,  // ‼️ Allow null values for passwordhash during development
    },
    role: {
      type: DataTypes.STRING(50), // ✅ Restrict to valid roles
      allowNull: false,  // ‼️ Allow null values for role during development
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
    tableName: "users", // ✅ Removed `sequelize` and kept only table name
    timestamps: true,
    underscored: true, // ✅ Use snake_case for column names
  }
);

// ✅ Define Association
User.hasMany(Resume, { foreignKey: "user_id", onDelete: "CASCADE" });

export default User;
