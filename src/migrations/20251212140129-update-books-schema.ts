'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('books', 'description', 'resume');

    await queryInterface.addColumn('books', 'genre', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Fiction', 
    });

    await queryInterface.addColumn('books', 'publication', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 2000, 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('books', 'publication');
    await queryInterface.removeColumn('books', 'genre');
    await queryInterface.renameColumn('books', 'resume', 'description');
  },
};
