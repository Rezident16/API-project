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
        url: 'https://static.wixstatic.com/media/7f2dd5_ce8271024b09442d8fbe7d0e1400baf5~mv2.png/v1/fill/w_1110,h_848,al_c/7f2dd5_ce8271024b09442d8fbe7d0e1400baf5~mv2.png',
        preview: true,
      },
      {
        groupId: 2,
        url: 'https://freetourcommunity.com/wp-content/uploads/2020/12/free_tour_sf_3.jpg',
        preview: false,
      },
      {
        groupId: 3,
        url: 'https://images.ctfassets.net/1aemqu6a6t65/6jvM8iPUs4E6Mu3onIjIwW/1a18b310821be5aab63a640d8f69df96/all-in-nyc_book_club_bar?q=72&w=1200&h=630&fit=fill',
        preview: true,
      },
      {
        groupId: 4,
        url: 'https://images.squarespace-cdn.com/content/v1/54ed5347e4b0baa5b2214761/1425020831671-GM26WMAE9XXWAT6G980V/San+Francisco+Marin+Mountain+Bike+Ride++full+size+pics-2.jpg?format=1000w',
        preview: true,
      },
      {
        groupId: 5,
        url: 'https://images.inc.com/uploaded_files/image/1920x1080/getty_495445876_970647970450088_104855.jpg',
        preview: true,
      },
      {
        groupId: 6,
        url: 'https://www.ameliavacations.com/wp-content/uploads/2018/05/yoga-on-the-beach.jpg',
        preview: true,
      },
      {
        groupId: 7,
        url: 'https://images.artsmia.org/wp-content/uploads/2023/04/12135730/art_and_wine.jpg',
        preview: true,
      },
      {
        groupId: 8,
        url: 'https://www.intrepidtravel.com/adventures/wp-content/uploads/2015/02/Intrepid-Travel-Nepal_Everest-Base-Camp_Group_Trek03.jpg',
        preview: true,
      },
      {
        groupId: 9,
        url: 'https://photographyworkshopsatlanta.com/wp-content/uploads/2020/04/TRE_6182-Copy-1.jpg',
        preview: true,
      },
      {
        groupId: 10,
        url: 'https://coloradomtn.edu/wp-content/uploads/2017/07/SUM-sushi-instructor-class.jpg',
        preview: true,
      },
      {
        groupId: 1,
        url: 'https://theedgesportscenter.com/wp-content/uploads/2022/08/Pickup-Soccer-01.jpeg',
        preview: true,
      },
      {
        groupId: 2,
        url: 'https://www.freetour.com/images/tours/729/free-san-francisco-tour-24.jpg',
        preview: true,
      },
      {
        groupId: 3,
        url: 'https://www.thegoodbook.co.uk/downloads/bookclub.jpg',
        preview: true,
      },
      {
        groupId: 4,
        url: 'https://ep1.pinkbike.org/p4pb15434401/p4pb15434401.jpg',
        preview: false,
      },
      {
        groupId: 5,
        url: 'https://www.travelperk.com/wp-content/uploads/alex-kotliarskyi-ourQHRTE2IM-unsplash-1024x683.jpg',
        preview: false,
      },
      {
        groupId: 6,
        url: 'https://www.madeirabeachyoga.com/wp-content/uploads/2022/09/IMG_2142-770x385.jpg',
        preview: false,
      },
      {
        groupId: 1,
        url: 'https://soccerworldcentral.ca/wp-content/uploads/2015/12/pick-up-image-772x528.jpg',
        preview: true,
      },
      {
        groupId: 1,
        url: 'https://static01.nyt.com/images/2023/09/15/multimedia/15soccer-pickup-01-vmzh/15soccer-pickup-01-vmzh-videoSixteenByNine3000.jpg',
        preview: true,
      },
      {
        groupId: 1,
        url: 'https://entrepreneurship.babson.edu/wp-content/uploads/2022/08/1200b-1.jpg',
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
