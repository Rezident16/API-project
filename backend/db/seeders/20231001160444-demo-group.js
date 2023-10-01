'use strict';

const { Group } = require('../models')
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define the data to be inserted (without createdAt and updatedAt)

    // Insert data into the "Groups" table
    await Group.bulkCreate([
      {
        organizerId: 1,
        name: 'Group 1',
        about: 'About Group 1',
        type: 'Art & Culture',
        private: false,
        city: 'City 1',
        state: 'State 1',
      },
      {
        organizerId: 2,
        name: 'Group 2',
        about: 'About Group 2',
        type: 'Technology',
        private: true,
        city: 'City 2',
        state: 'State 2',
      },
    ], { validate: true });
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';

    await queryInterface.bulkDelete('Groups', null, {});
  }
};
