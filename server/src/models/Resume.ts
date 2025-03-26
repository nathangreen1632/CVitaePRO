import { DataTypes, Model, Sequelize } from "sequelize";

export interface IResume extends Model {
  file_hash: string;
  user_id?: string;
  extracted_text?: string;
  updated_at?: Date;
}

export default (sequelize: Sequelize) => {
  return sequelize.define<IResume>(
    "Resume",
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
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "Resumes",
      timestamps: true,
    }
  );
};
