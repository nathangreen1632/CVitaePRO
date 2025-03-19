import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./User.js";

export interface ICoverLetter extends Model {
  id: string;
  user_id: string;
  content: string;
  created_at?: Date;
  updated_at?: Date;
}

const CoverLetter = sequelize.define<ICoverLetter>(
  "CoverLetter",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    tableName: "cover_letters",
    timestamps: true,
  }
);

CoverLetter.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(CoverLetter, { foreignKey: "user_id", onDelete: "CASCADE" });

export default CoverLetter;
