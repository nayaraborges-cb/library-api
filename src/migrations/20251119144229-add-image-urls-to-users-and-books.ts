import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('users', 'avatarUrl', {
      type: DataTypes.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('books', 'coverUrl', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('users', 'avatarUrl');
    await queryInterface.removeColumn('books', 'coverUrl');
  }
};
