'use strict';

const { Event } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Event.bulkCreate([
      {
        venueId: 1,
        groupId: 1,
        name: 'Demo',
        description: 'description',
        type: 'In Person Indoor',
        capacity: 20,
        price: 10,
        startDate: new Date(),
        endDate: new Date()
      },
      {
        venueId: 1,
        groupId: 2,
        name: 'Demo',
        description: 'description',
        type: 'In Person Indoor',
        capacity: 30,
        price: 14,
        startDate: new Date(),
        endDate: new Date()
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'Demo',
        description: 'description',
        type: 'In Person Indoor',
        capacity: 40,
        price: 20,
        startDate: new Date(),
        endDate: new Date()
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Demo'] }
    }, {});
  }
};
