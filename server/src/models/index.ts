import User from "./User.js";
import Resume from "./Resume.js";

const associateModels = () => {
  User.hasMany(Resume, { foreignKey: "user_id", onDelete: "CASCADE" });
  Resume.belongsTo(User, { foreignKey: "user_id" });
};

export { User, Resume, associateModels };
