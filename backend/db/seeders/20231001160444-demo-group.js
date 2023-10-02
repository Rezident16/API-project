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
        name: 'Boston Soccer',
        about: 'Let\'s meetup in Boston Commons for some friendlies. We are meeting on Sundays at 9:30am. Make sure to RSVP, or you wont be allowed to play',
        type: 'Online',
        private: false,
        city: 'Boston',
        state: 'MA',
      },
      {
        organizerId: 2,
        name: 'SF Walks',
        about: 'Hey friend. Come and join us during our weekly walks around the BAY. Great opportunity for us to make friends!',
        type: 'In Person',
        private: true,
        city: 'San Francisco',
        state: 'CA',
      },
    ], { validate: true });
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';

    await queryInterface.bulkDelete('Groups', null, {});
  }
};
