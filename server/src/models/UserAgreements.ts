import { DataTypes, Model, Sequelize } from "sequelize";

export interface IUserAgreement extends Model {
  id: string;
  userId: string;
  documentType: string;
  version: string;
  acceptedAt: Date;
}

export default (sequelize: Sequelize) => {
  return sequelize.define<IUserAgreement>(
    "UserAgreement",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      documentType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      version: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      acceptedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    },
    {
      tableName: "UserAgreements",
      timestamps: true,
    }
  );
};
