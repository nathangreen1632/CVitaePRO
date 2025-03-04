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
      allowNull: true,  // ‼️ Allow null values for user_id during development
    },
    extracted_text: {
      type: DataTypes.TEXT,
      allowNull: true,  // ‼️ Allow null values for extracted_text during development
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,  // ‼️ Allow null values for updated_at during development
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

// ✅ Associations are handled in models/index.ts
export default Resume;
