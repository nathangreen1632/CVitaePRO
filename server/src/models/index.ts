import { Sequelize } from "sequelize";
import UserModel from "./User.js";
import ResumeModel from "./Resume.js";
import CoverLetterModel from "./CoverLetter.js";
import UserAgreementModel from "./UserAgreements.js";

const initModels = (sequelize: Sequelize) => {
  const User = UserModel(sequelize); // this loads the model "User" mapped to table "Users"
  const Resume = ResumeModel(sequelize);
  const CoverLetter = CoverLetterModel(sequelize);
  const UserAgreement = UserAgreementModel(sequelize);

  // Associations
  User.hasMany(Resume, {
    foreignKey: "user_id",
    sourceKey: "id",                  // 🔧 ensures proper target
    onDelete: "CASCADE",
  });
  Resume.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "id",                  // 🔧 target column in "Users"
  });

  User.hasMany(CoverLetter, {
    foreignKey: "user_id",
    sourceKey: "id",
    onDelete: "CASCADE",
  });
  CoverLetter.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "id",
  });

  User.hasMany(UserAgreement, {
    foreignKey: "userId",
    sourceKey: "id",
    onDelete: "CASCADE",
  });
  UserAgreement.belongsTo(User, {
    foreignKey: "userId",
    targetKey: "id",
  });

  return {
    User,
    Resume,
    CoverLetter,
    UserAgreement,
  };
};


export default initModels;
