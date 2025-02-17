import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: "postgres", // Change to "mysql" or another DB type if needed
  logging: false, // Set to true for debugging queries
});

export default sequelize;
