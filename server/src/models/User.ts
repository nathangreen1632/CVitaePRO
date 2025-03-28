import { DataTypes, Model, Sequelize } from "sequelize";

export interface IUser extends Model {
  id: string;
  username: string;
  passwordhash: string;
  role: string;
}

export default (sequelize: Sequelize) => {
  return sequelize.define<IUser>(
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
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: true,
    }
  );
};
