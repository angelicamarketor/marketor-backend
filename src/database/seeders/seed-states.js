'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('state', [
      {
        idState: 1,
        name: 'ACTIVE',
      },
      {
        idState: 2,
        name: 'INACTIVE',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('state', null, {});
  },
};