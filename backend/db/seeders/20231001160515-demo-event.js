"use strict";

const { Event } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Event.bulkCreate(
      [
        {
          venueId: 1,
          groupId: 1,
          name: "Pickup Soccer at Boston Commons",
          description: `Join us for a day of pure soccer bliss at our "Community Kickabout" pickup soccer event. Whether you're an experienced player or a beginner, this is the ultimate celebration of the beautiful game, uniting people of all ages and skill levels. Enjoy the thrill of scoring goals, making incredible saves, and connecting with fellow soccer enthusiasts. It's more than just a game; it's a day filled with fun, friendship, and unforgettable moments on the pitch. Don't miss out on this fantastic opportunity to celebrate the love of soccer and create lasting memories. Grab your cleats and be part of the action – "Community Kickabout" is where soccer dreams come to life!`,
          type: "In person",
          capacity: 3,
          price: 10,
          startDate: new Date("2023-11-05"),
          endDate: new Date("2023-11-05"),
        },
        {
          venueId: 2,
          groupId: 2,
          name: "Demo",
          description: "description",
          type: "In person",
          capacity: 30,
          price: 14,
          startDate: new Date("2023-12-15"),
          endDate: new Date("2023-12-15"),
        },
        {
          venueId: 3,
          groupId: 3,
          name: "Demo",
          description: "description",
          type: "Online",
          capacity: 40,
          price: 20,
          startDate: new Date("2023-10-28"),
          endDate: new Date("2023-10-28"),
        },
        {
          venueId: 4,
          groupId: 4,
          name: "DemoLab",
          description: "description",
          type: "In person",
          capacity: 20,
          price: 10,
          startDate: new Date("2023-11-20"),
          endDate: new Date("2023-11-20"),
        },
        {
          venueId: 5,
          groupId: 5,
          name: "Demo5",
          description: "description",
          type: "In person",
          capacity: 30,
          price: 14,
          startDate: new Date("2024-01-05"),
          endDate: new Date("2024-01-05"),
        },
        {
          venueId: 6,
          groupId: 6,
          name: "Demo6",
          description: "description",
          type: "Online",
          capacity: 40,
          price: 20,
          startDate: new Date("2023-12-10"),
          endDate: new Date("2023-12-10"),
        },
        {
          venueId: 7,
          groupId: 7,
          name: "DemoLab1",
          description: "description",
          type: "In person",
          capacity: 20,
          price: 10,
          startDate: new Date("2024-02-18"),
          endDate: new Date("2024-02-18"),
        },
        {
          venueId: 8,
          groupId: 8,
          name: "Demo123",
          description: "description",
          type: "In person",
          capacity: 30,
          price: 14,
          startDate: new Date("2024-01-15"),
          endDate: new Date("2024-01-15"),
        },
        {
          venueId: 9,
          groupId: 9,
          name: "Demo321",
          description: "description",
          type: "Online",
          capacity: 40,
          price: 20,
          startDate: new Date("2024-03-22"),
          endDate: new Date("2024-03-22"),
        },
        {
          venueId: 10,
          groupId: 10,
          name: "DemoLab5",
          description: "description",
          type: "In person",
          capacity: 20,
          price: 10,
          startDate: new Date("2024-02-05"),
          endDate: new Date("2024-02-05"),
        },
        {
          venueId: 11,
          groupId: 1,
          name: "Casual Pickup Soccer Game",
          description: `Join us for a laid-back and enjoyable pickup soccer game at the local park this Saturday afternoon. Whether you're an experienced player or a newbie, everyone is welcome to participate in this friendly match. Bring your friends or make new ones while enjoying a few hours of fun, camaraderie, and the beautiful game of soccer. Just show up with your sneakers, and we'll take care of the rest.`,
          type: "In person",
          capacity: 30,
          price: 14,
          startDate: new Date("2023-04-10"),
          endDate: new Date("2023-04-10"),
        },
        {
          venueId: 12,
          groupId: 2,
          name: "Demo8",
          description: "description",
          type: "Online",
          capacity: 40,
          price: 20,
          startDate: new Date("2024-03-08"),
          endDate: new Date("2024-03-08"),
        },
        {
          venueId: 13,
          groupId: 3,
          name: "DemoLab9",
          description: "description",
          type: "In person",
          capacity: 20,
          price: 10,
          startDate: new Date("2024-05-12"),
          endDate: new Date("2024-05-12"),
        },
        {
          venueId: 14,
          groupId: 1,
          name: "Family-Friendly Soccer Match",
          description: `Looking for a family-friendly soccer event? Our pickup soccer game is the perfect choice! It's a fantastic way to spend quality time with your loved ones while getting some exercise. Kids and adults of all skill levels are encouraged to participate. Come and create lasting memories as you dribble, pass, and score in a relaxed and inclusive environment.`,
          type: "In person",
          capacity: 30,
          price: 14,
          startDate: new Date("2024-04-25"),
          endDate: new Date("2024-04-25"),
        },
        {
          venueId: 1,
          groupId: 1,
          name: "Sunset Soccer Showdown",
          description: `Experience the thrill of soccer under the setting sun at our Sunset Soccer Showdown event. As the day winds down, the competition heats up on the field. Whether you're a skilled player or just enjoy the sport, you won't want to miss this opportunity to play soccer as the sun dips below the horizon. Grab your gear, gather your friends, and let's play some soccer until the stars come out`,
          type: "In person",
          capacity: 40,
          price: 20,
          startDate: new Date(2023, 10, 1, 18, 0),
          endDate: new Date("2024-06-15"),
        },
        {
          venueId: 12,
          groupId: 2,
          name: "DemoLab12",
          description: "description",
          type: "In person",
          capacity: 20,
          price: 10,
          startDate: new Date("2024-05-02"),
          endDate: new Date("2024-05-02"),
        },
        {
          venueId: 13,
          groupId: 3,
          name: "Demo13",
          description: "description",
          type: "In person",
          capacity: 30,
          price: 14,
          startDate: new Date("2022-07-20"),
          endDate: new Date("2024-07-20"),
        },
        {
          venueId: 1,
          groupId: 1,
          name: "Soccer in the City",
          description: `Kick off your weekend with a lively game of soccer right in the heart of the city. Our urban pickup soccer game is perfect for those looking to release some midweek stress, meet fellow soccer enthusiasts, and embrace the urban soccer culture. The city skyline makes for a stunning backdrop as you showcase your skills, share your passion for the game, and enjoy the camaraderie that comes with playing soccer in a bustling metropolis`,
          type: "In person",
          capacity: 40,
          price: 20,
          startDate: new Date("2022-06-08"),
          endDate: new Date("2024-06-08"),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        groupId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      },
      {}
    );
  },
};
