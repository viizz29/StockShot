'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Users', // table name
        'isAdmin', // new field name
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
      ),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Users', 'isAdmin'),
    ]);
  }
};
