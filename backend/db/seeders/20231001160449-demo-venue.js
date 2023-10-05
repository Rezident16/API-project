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
        city: 'Boston',
        state: 'MA',
        lat: 23.456,
        lng: -89.012,
      },
      {
        groupId: 2,
        address: '456 Elm St',
        city: 'San Francisco',
        state: 'CA',
        lat: 56.789,
        lng: -45.678,
      },
      {
        groupId: 3,
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        lat: 23.456,
        lng: -89.012,
      },
      {
        groupId: 4,
        address: '456 Elm St',
        city: 'Denver',
        state: 'CO',
        lat: 56.789,
        lng: -45.678,
      },
      {
        groupId: 5,
        address: '123 Main St',
        city: 'Knoxville',
        state: 'TN',
        lat: 23.456,
        lng: -89.012,
      },
      {
        groupId: 6,
        address: '456 Elm St',
        city: 'Miami',
        state: 'FL',
        lat: 56.789,
        lng: -45.678,
      },
      {
        groupId: 7,
        address: '123 Main St',
        city: 'Napa Valley',
        state: 'CA',
        lat: 23.456,
        lng: -89.012,
      },
      {
        groupId: 8,
        address: '456 Elm St',
        city: 'Seattle',
        state: 'WA',
        lat: 56.789,
        lng: -45.678,
      },
      {
        groupId: 9,
        address: '123 Main St',
        city: 'Los Angeles',
        state: 'CA',
        lat: 23.456,
        lng: -89.012,
      },
      {
        groupId: 10,
        address: '456 Elm St',
        city: 'Chicago',
        state: 'IL',
        lat: 56.789,
        lng: -45.678,
      },
      {
        groupId: 1,
        address: '123 Main St',
        city: 'Boston',
        state: 'MA',
        lat: 23.456,
        lng: -89.012,
      },
      {
        groupId: 2,
        address: '456 Elm St',
        city: 'San Francisco',
        state: 'CA',
        lat: 56.789,
        lng: -45.678,
      },
      {
        groupId: 3,
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        lat: 23.456,
        lng: -89.012,
      },
      {
        groupId: 1,
        address: '456 Elm St',
        city: 'Boston',
        state: 'MA',
        lat: 56.789,
        lng: -45.678,
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1,2,3,4,5,6,7,8,9,10] }
    }, {});
  }
};
