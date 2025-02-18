import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export interface IResume extends Model {
  id: number;
  userId: number;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const Resume = sequelize.define<IResume>("Resume", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default Resume;
