import { Sequelize } from "sequelize";
import UserModel from "./User.js";
import ResumeModel from "./Resume.js";
import CoverLetterModel from "./CoverLetter.js";
import UserAgreementModel from "./UserAgreements.js";

const initModels = (sequelize: Sequelize) => {
  const User = UserModel(sequelize);
  const Resume = ResumeModel(sequelize);
  const CoverLetter = CoverLetterModel(sequelize);
  const UserAgreement = UserAgreementModel(sequelize);

  // Associations
  User.hasMany(Resume, { foreignKey: "user_id", onDelete: "CASCADE" });
  Resume.belongsTo(User, { foreignKey: "user_id" });

  User.hasMany(CoverLetter, { foreignKey: "user_id", onDelete: "CASCADE" });
  CoverLetter.belongsTo(User, { foreignKey: "user_id" });

  User.hasMany(UserAgreement, { foreignKey: "userId", onDelete: "CASCADE" });
  UserAgreement.belongsTo(User, { foreignKey: "userId" });

  return {
    User,
    Resume,
    CoverLetter,
    UserAgreement,
  };
};

export default initModels;
