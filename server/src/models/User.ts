import { DataTypes, Model, Sequelize } from "sequelize";

export interface IUser extends Model {
  passwordHash: string;
  id: string;
  username: string;
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
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "passwordHash",
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
      },
    },
    {
      tableName: "Users",
      timestamps: true,
    }
  );
};

