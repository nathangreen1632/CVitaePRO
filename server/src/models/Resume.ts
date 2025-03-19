import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

class Resume extends Model {}

Resume.init(
  {
    file_hash: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    extracted_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Resume",
    tableName: "Resumes",
    timestamps: true,
  }
);

export default Resume;
