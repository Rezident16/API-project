'use strict';

const { Attendance } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Attendance.bulkCreate([
      {
        eventId: 1,
        userId: 1,
        status: 'attending',
      },
      {
        eventId: 1,
        userId: 2,
        status: 'attending',
      },
      {
        eventId: 1,
        userId: 7,
        status: 'attending',
      },
      {
        eventId: 1,
        userId: 8,
        status: 'waitlist',
      },
      {
        eventId: 1,
        userId: 10,
        status: 'pending',
      },
      {
        eventId: 2,
        userId: 2,
        status: 'attending',
      },
      {
        eventId: 2,
        userId: 8,
        status: 'pending',
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3,4,5,6,7,8,9,10] }
    }, {});
  }
};
