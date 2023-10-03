'use strict';

const { Venue } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Venue.bulkCreate([
      {
        groupId: 1,
        address: '123 Main St',
        city: 'City 1',
        state: 'State 1',
        lat: 23.456,
        lng: -89.012,
      },
      {
        groupId: 2,
        address: '456 Elm St',
        city: 'City 2',
        state: 'State 2',
        lat: 56.789,
        lng: -45.678,
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1,2] }
    }, {});
  }
};
