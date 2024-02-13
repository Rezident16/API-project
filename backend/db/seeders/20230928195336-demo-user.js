'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstName: 'Demo',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser2',
        firstName: 'Fake',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user2@user.io',
        username: 'CoolUser1',
        firstName: 'Cool',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'user3@user.io',
        username: 'AwesomeUser2',
        firstName: 'Awesome',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        email: 'user4@user.io',
        username: 'FantasticUser3',
        firstName: 'Fantastic',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        email: 'user5@user.io',
        username: 'SuperUser4',
        firstName: 'Super',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('password6')
      },
      {
        email: 'user6@user.io',
        username: 'MegaUser5',
        firstName: 'Mega',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('password7')
      },
      {
        email: 'user7@user.io',
        username: 'EpicUser6',
        firstName: 'Epic',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('password8')
      },
      {
        email: 'user8@user.io',
        username: 'LegendUser7',
        firstName: 'Legend',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('password9')
      },
      {
        email: 'user9@user.io',
        username: 'PowerUser8',
        firstName: 'Power',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('password10')
      },
      {
        email: 'user10@user.io',
        username: 'NinjaUser9',
        firstName: 'Ninja',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('password11')
      },
      {
        email: 'user11@user.io',
        username: 'MasterUser10',
        firstName: 'Master',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('password12')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'FakeUser3', 'FakeUser4', 'FakeUser5', 'FakeUser6', 'FakeUser7', 'FakeUser8', 'FakeUser9', 'FakeUser10',
      'CoolUser1', 'AwesomeUser2', 'FantasticUser3', 'SuperUser4', 'MegaUser5', 'EpicUser6', 'LegendUser7', 'PowerUser8', 'NinjaUser9', 'MasterUser10'] }
    }, {});
  }
};
