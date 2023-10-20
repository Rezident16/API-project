'use strict';

const { Event } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Event.bulkCreate([
      {
        venueId: 1,
        groupId: 1,
        name: 'DemoLab',
        description: 'description',
        type: 'In person',
        capacity: 3,
        price: 10,
        startDate: new Date('2023-11-05'),
        endDate: new Date('2023-11-05')
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'Demo',
        description: 'description',
        type: 'In person',
        capacity: 30,
        price: 14,
        startDate: new Date('2023-12-15'),
        endDate: new Date('2023-12-15')
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'Demo',
        description: 'description',
        type: 'Online',
        capacity: 40,
        price: 20,
        startDate: new Date('2023-10-28'),
        endDate: new Date('2023-10-28')
      },
      {
        venueId: 4,
        groupId: 4,
        name: 'DemoLab',
        description: 'description',
        type: 'In person',
        capacity: 20,
        price: 10,
        startDate: new Date('2023-11-20'),
        endDate: new Date('2023-11-20')
      },
      {
        venueId: 5,
        groupId: 5,
        name: 'Demo5',
        description: 'description',
        type: 'In person',
        capacity: 30,
        price: 14,
        startDate: new Date('2024-01-05'),
        endDate: new Date('2024-01-05')
      },
      {
        venueId: 6,
        groupId: 6,
        name: 'Demo6',
        description: 'description',
        type: 'Online',
        capacity: 40,
        price: 20,
        startDate: new Date('2023-12-10'),
        endDate: new Date('2023-12-10')
      },
      {
        venueId: 7,
        groupId: 7,
        name: 'DemoLab1',
        description: 'description',
        type: 'In person',
        capacity: 20,
        price: 10,
        startDate: new Date('2024-02-18'),
        endDate: new Date('2024-02-18')
      },
      {
        venueId: 8,
        groupId: 8,
        name: 'Demo123',
        description: 'description',
        type: 'In person',
        capacity: 30,
        price: 14,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-15')
      },
      {
        venueId: 9,
        groupId: 9,
        name: 'Demo321',
        description: 'description',
        type: 'Online',
        capacity: 40,
        price: 20,
        startDate: new Date('2024-03-22'),
        endDate: new Date('2024-03-22')
      },
      {
        venueId: 10,
        groupId: 10,
        name: 'DemoLab5',
        description: 'description',
        type: 'In person',
        capacity: 20,
        price: 10,
        startDate: new Date('2024-02-05'),
        endDate: new Date('2024-02-05')
      },
      {
        venueId: 11,
        groupId: 1,
        name: 'Demo7',
        description: 'description',
        type: 'In person',
        capacity: 30,
        price: 14,
        startDate: new Date('2024-04-10'),
        endDate: new Date('2024-04-10')
      },
      {
        venueId: 12,
        groupId: 2,
        name: 'Demo8',
        description: 'description',
        type: 'Online',
        capacity: 40,
        price: 20,
        startDate: new Date('2024-03-08'),
        endDate: new Date('2024-03-08')
      },
      {
        venueId: 13,
        groupId: 3,
        name: 'DemoLab9',
        description: 'description',
        type: 'In person',
        capacity: 20,
        price: 10,
        startDate: new Date('2024-05-12'),
        endDate: new Date('2024-05-12')
      },
      {
        venueId: 14,
        groupId: 1,
        name: 'Demo10',
        description: 'description',
        type: 'In person',
        capacity: 30,
        price: 14,
        startDate: new Date('2024-04-25'),
        endDate: new Date('2024-04-25')
      },
      {
        venueId: 1,
        groupId: 1,
        name: 'Demo11',
        description: 'description',
        type: 'Online',
        capacity: 40,
        price: 20,
        startDate: new Date('2024-06-15'),
        endDate: new Date('2024-06-15')
      },
      {
        venueId: 12,
        groupId: 2,
        name: 'DemoLab12',
        description: 'description',
        type: 'In person',
        capacity: 20,
        price: 10,
        startDate: new Date('2024-05-02'),
        endDate: new Date('2024-05-02')
      },
      {
        venueId: 13,
        groupId: 3,
        name: 'Demo13',
        description: 'description',
        type: 'In person',
        capacity: 30,
        price: 14,
        startDate: new Date('2024-07-20'),
        endDate: new Date('2024-07-20')
      },
      {
        venueId: 1,
        groupId: 1,
        name: 'Demo14',
        description: 'description',
        type: 'Online',
        capacity: 40,
        price: 20,
        startDate: new Date('2024-06-08'),
        endDate: new Date('2024-06-08')
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1,2,3,4,5,6,7,8,9,10] }
    }, {});
  }
};
