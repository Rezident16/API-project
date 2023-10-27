'use strict';

const { Group } = require('../models')
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define the data to be inserted (without createdAt and updatedAt)

    // Insert data into the "Groups" table
    await Group.bulkCreate([
      {
        organizerId: 1,
        name: 'Boston Soccer',
        about: 'Let\'s meetup in Boston Commons for some friendlies. Make sure to RSVP, or you wont be allowed to play',
        type: 'Online',
        private: false,
        city: 'Boston',
        state: 'MA',
      },
      {
        organizerId: 2,
        name: 'SF Walks',
        about: 'Hey friend. Come and join us during our weekly walks around the BAY. Great opportunity for us to make friends!',
        type: 'In person',
        private: true,
        city: 'San Francisco',
        state: 'CA',
      },
      // {
      //   organizerId: 3,
      //   name: 'NYC Book Club',
      //   about: 'Join our book club in the heart of New York City. We meet every other Saturday to discuss the latest bestsellers and literary classics.',
      //   type: 'In person',
      //   private: false,
      //   city: 'New York',
      //   state: 'NY',
      // },
      // {
      //   organizerId: 4,
      //   name: 'Mountain Biking Adventures',
      //   about: 'Explore the beautiful trails of the Rocky Mountains with fellow biking enthusiasts. All skill levels welcome!',
      //   type: 'In person',
      //   private: false,
      //   city: 'Denver',
      //   state: 'CO',
      // },
      // {
      //   organizerId: 5,
      //   name: 'Tech Talks Online',
      //   about: 'Join us for online tech talks and discussions. We cover a wide range of topics, from programming to emerging technologies.',
      //   type: 'Online',
      //   private: true,
      //   city: 'Knxville',
      //   state: 'TN',
      // },
      // {
      //   organizerId: 4,
      //   name: 'Yoga by the Beach',
      //   about: 'Experience the tranquility of yoga by the beach. We gather every morning to practice yoga and meditation by the ocean.',
      //   type: 'In person',
      //   private: false,
      //   city: 'Miami',
      //   state: 'FL',
      // },
      // {
      //   organizerId: 1,
      //   name: 'Art and Wine Tasting',
      //   about: 'Indulge in art and fine wine at our monthly events. Discover local artists and savor exquisite wines in a relaxed atmosphere.',
      //   type: 'In person',
      //   private: false,
      //   city: 'Napa Valley',
      //   state: 'CA',
      // },
      // {
      //   organizerId: 3,
      //   name: 'Hiking Adventures',
      //   about: 'Join us for challenging hiking adventures in the wilderness. Prepare for breathtaking views and unforgettable experiences.',
      //   type: 'In person',
      //   private: false,
      //   city: 'Seattle',
      //   state: 'WA',
      // },
      {
        organizerId: 2,
        name: 'Photography Workshops',
        about: 'Enhance your photography skills through our hands-on workshops. Learn from experienced photographers and capture stunning moments.',
        type: 'In person',
        private: false,
        city: 'Los Angeles',
        state: 'CA',
      },
      {
        organizerId: 1,
        name: 'Cooking Classes',
        about: 'Join us for a fabulous cooking experience. We will teach you the ins and outs of how to cook an amazing meal so you impress your friends, family, or your significant other.',
        type: 'Online',
        private: false,
        city: 'Chicago',
        state: 'IL',
      } 
      
    ], { validate: true });
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';

    await queryInterface.bulkDelete('Groups', null, {});
  }
};
