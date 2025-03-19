'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Resumes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT
      },
      extracted_text: {
        type: Sequelize.TEXT
      },
      file_hash: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.TEXT
      },
      phone: {
        type: Sequelize.TEXT
      },
      linkedin: {
        type: Sequelize.TEXT
      },
      portfolio: {
        type: Sequelize.TEXT
      },
      experience: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      education: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      skills: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      certifications: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Resumes');
  }
};
