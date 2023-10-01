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
        status: 'Pending',
      },
      {
        userId: 2,
        groupId: 1,
        status: 'Pending',
      },
      {
        userId: 1,
        groupId: 2,
        status: 'Pending',
      },
      {
        userId: 3,
        groupId: 1,
        status: 'Joined',
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1] }
    }, {});
  }
};
