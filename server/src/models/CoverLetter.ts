import { DataTypes, Model, Sequelize } from "sequelize";

export interface ICoverLetter extends Model {
  id: string;
  user_id: string;
  content: string;
  created_at?: Date;
  updated_at?: Date;
}

export default (sequelize: Sequelize) => {
  return sequelize.define<ICoverLetter>(
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
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "cover_letters",
      timestamps: true,
    }
  );
};
