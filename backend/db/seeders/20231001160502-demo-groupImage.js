'use strict';

const { GroupImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await GroupImage.bulkCreate([
      {
        groupId: 1,
        url: 'Demo-lition',
        preview: true,
      },
      {
        groupId: 2,
        url: 'Demo-lition',
        preview: false,
      },
      {
        groupId: 3,
        url: 'Demo-lition',
        preview: true,
      },
      {
        groupId: 4,
        url: 'Demo-lition',
        preview: true,
      },
      {
        groupId: 5,
        url: 'Demo-lition',
        preview: true,
      },
      {
        groupId: 6,
        url: 'Demo-lition',
        preview: true,
      },
      {
        groupId: 7,
        url: 'Demo-lition',
        preview: true,
      },
      {
        groupId: 8,
        url: 'Demo-lition',
        preview: false,
      },
      {
        groupId: 9,
        url: 'Demo-lition',
        preview: false,
      },
      {
        groupId: 10,
        url: 'Demo-lition',
        preview: false,
      },
      {
        groupId: 1,
        url: 'Demo-lition',
        preview: true,
      },
      {
        groupId: 2,
        url: 'Demo-lition',
        preview: true,
      },
      {
        groupId: 3,
        url: 'Demo-lition',
        preview: true,
      },
      {
        groupId: 4,
        url: 'Demo-lition',
        preview: false,
      },
      {
        groupId: 5,
        url: 'Demo-lition',
        preview: false,
      },
      {
        groupId: 6,
        url: 'Demo-lition',
        preview: false,
      },
      {
        groupId: 1,
        url: 'Demo-lition',
        preview: true,
      },
      {
        groupId: 1,
        url: 'Demo-lition',
        preview: true,
      },
      {
        groupId: 1,
        url: 'Demo-lition',
        preview: true,
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1,2,3,4,5,6,7,8,9,10] }
    }, {});
  }
};
