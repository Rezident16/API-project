'use strict';

const { Membership } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Membership.bulkCreate([
      {
        userId: 1,
        groupId: 1,
        status: 'co-host',
      },
      {
        userId: 2,
        groupId: 2,
        status: 'co-host',
      },
      {
        userId: 2,
        groupId: 3,
        status: 'co-host',
      },
      {
        userId: 1,
        groupId: 4,
        status: 'co-host',
      },
      // {
      //   userId: 5,
      //   groupId: 5,
      //   status: 'co-host',
      // },
      // {
      //   userId: 4,
      //   groupId: 6,
      //   status: 'co-host',
      // },
      // {
      //   userId: 1,
      //   groupId: 7,
      //   status: 'co-host',
      // },
      // {
      //   userId: 3,
      //   groupId: 8,
      //   status: 'co-host',
      // },
      // {
      //   userId: 2,
      //   groupId: 9,
      //   status: 'co-host',
      // },
      // {
      //   userId: 1,
      //   groupId: 10,
      //   status: 'co-host',
      // },
      // {
      //   userId: 1,
      //   groupId: 2,
      //   status: 'member',
      // },
      // {
      //   userId: 6,
      //   groupId: 2,
      //   status: 'pending',
      // },
      // {
      //   userId: 2,
      //   groupId: 1,
      //   status: 'co-host',
      // },
      // {
      //   userId: 3,
      //   groupId: 1,
      //   status: 'pending',
      // },
      // {
      //   userId: 7,
      //   groupId: 1,
      //   status: 'member',
      // },
      // {
      //   userId: 8,
      //   groupId: 1,
      //   status: 'co-host',
      // },
      // {
      //   userId: 9,
      //   groupId: 1,
      //   status: 'pending',
      // },
      // {
      //   userId: 10,
      //   groupId: 1,
      //   status: 'member',
      // },
      // {
      //   userId: 2,
      //   groupId: 4,
      //   status: 'member',
      // },
      // {
      //   userId: 2,
      //   groupId: 5,
      //   status: 'co-host',
      // },
      // {
      //   userId: 7,
      //   groupId: 2,
      //   status: 'pending',
      // },
      // {
      //   userId: 10,
      //   groupId: 8,
      //   status: 'member',
      // },
      // {
      //   userId: 9,
      //   groupId: 2,
      //   status: 'pending',
      // },
      // {
      //   userId: 8,
      //   groupId: 2,
      //   status: 'co-host',
      // },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1,2,3,4,5,6,7,8,9,10] }
    }, {});
  }
};
