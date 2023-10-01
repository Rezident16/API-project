'use strict';

const { EventImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await EventImage.bulkCreate([
      {
        eventId: 1,
        url: 'url',
        preview: true,
      },
      {
        eventId: 2,
        url: 'url',
        preview: true,
      },
      {
        eventId: 3,
        url: 'url',
        preview: true,
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['url'] }
    }, {});
  }
};
