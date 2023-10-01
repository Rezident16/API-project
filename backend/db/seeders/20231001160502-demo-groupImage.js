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
        groupId: 1,
        url: 'Demo-lition',
        preview: false,
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
      groupId: { [Op.in]: [1] }
    }, {});
  }
};
