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
        url: 'url1',
        preview: true,
      },
      {
        eventId: 2,
        url: 'url2',
        preview: true,
      },
      {
        eventId: 3,
        url: 'url3',
        preview: true,
      },
      {
        eventId: 4,
        url: 'url4',
        preview: true,
      },
      {
        eventId: 1,
        url: 'url5',
        preview: false,
      },
      {
        eventId: 1,
        url: 'url6',
        preview: true,
      },
      {
        eventId: 7,
        url: 'url7',
        preview: false,
      },
      {
        eventId: 8,
        url: 'url8',
        preview: true,
      },
      {
        eventId: 9,
        url: 'url9',
        preview: false,
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1,2,3,4,5,6,7,8,9,10] }
    }, {});
  }
};
