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




      
      // {
      //   email: 'user2@user.io',
      //   username: 'FakeUser3',
      //   firstName: 'Andrei',
      //   lastName: 'Vorobev',
      //   hashedPassword: bcrypt.hashSync('password3')
      // },
      // {
      //   email: 'user3@user.io',
      //   username: 'FakeUser4',
      //   firstName: 'John',
      //   lastName: 'Doe',
      //   hashedPassword: bcrypt.hashSync('password4')
      // },
      // {
      //   email: 'user4@user.io',
      //   username: 'FakeUser5',
      //   firstName: 'Alex',
      //   lastName: 'Fraser',
      //   hashedPassword: bcrypt.hashSync('password5')
      // },
      // {
      //   email: 'user5@user.io',
      //   username: 'FakeUser6',
      //   firstName: 'Olivia',
      //   lastName: 'Castro',
      //   hashedPassword: bcrypt.hashSync('password6')
      // },
      // {
      //   email: 'user6@user.io',
      //   username: 'FakeUser7',
      //   firstName: 'John',
      //   lastName: 'Terry',
      //   hashedPassword: bcrypt.hashSync('password7')
      // },
      // {
      //   email: 'user7@user.io',
      //   username: 'FakeUser8',
      //   firstName: 'Monica',
      //   lastName: 'Bernard',
      //   hashedPassword: bcrypt.hashSync('password8')
      // },
      // {
      //   email: 'user8@user.io',
      //   username: 'FakeUser9',
      //   firstName: 'Pam',
      //   lastName: 'Weasly',
      //   hashedPassword: bcrypt.hashSync('password9')
      // },
      // {
      //   email: 'user9@user.io',
      //   username: 'FakeUser10',
      //   firstName: 'Michael',
      //   lastName: 'Scott',
      //   hashedPassword: bcrypt.hashSync('password10')
      // },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'FakeUser3', 'FakeUser4', 'FakeUser5', 'FakeUser6', 'FakeUser7', 'FakeUser8', 'FakeUser9', 'FakeUser10'] }
    }, {});
  }
};
