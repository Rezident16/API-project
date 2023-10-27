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
        url: 'https://static.wixstatic.com/media/7f2dd5_ce8271024b09442d8fbe7d0e1400baf5~mv2.png/v1/fill/w_1110,h_848,al_c/7f2dd5_ce8271024b09442d8fbe7d0e1400baf5~mv2.png',
        preview: true,
      },
      {
        eventId: 2,
        url: 'https://images.ctfassets.net/twizyp0t114t/1S8Fp4CehxU9933soTT4Jr/0dc83a89e00c20f82108cb341b368135/walks_sf_day_01.jpg?fm=webp&w=1200&q=95&fit=fill&f=face',
        preview: true,
      },
      {
        eventId: 3,
        url: 'https://www.joblo.com/wp-content/uploads/2022/05/book-club-2-production.jpg',
        preview: true,
      },
      {
        eventId: 4,
        url: 'https://www.knoxmercury.com/wp-content/uploads/2015/07/cover_homepage2_0709.jpg',
        preview: true,
      },
      // {
      //   eventId: 5,
      //   url: 'https://blog.zoom.us/wp-content/uploads/2022/12/Advanced-Views-1.png',
      //   preview: true,
      // },
      // {
      //   eventId: 6,
      //   url: 'https://static1.squarespace.com/static/5c1500ad1137a6de183d0730/t/645076bb9b573b31ae47f951/1683047311374/beach_yoga_classes_and_meditation.jpg?format=1500w',
      //   preview: true,
      // },
      // {
      //   eventId: 7,
      //   url: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/wine-tasting-johann-peter-hasenclever.jpg',
      //   preview: true,
      // },
      // {
      //   eventId: 8,
      //   url: 'https://media.gadventures.com/media-server/cache/76/dc/76dcc71a350b8ec1450f2ed8ca23edfe.jpg',
      //   preview: true,
      // },
      // {
      //   eventId: 9,
      //   url: 'https://spraggonphotography.co.uk/blog/wp-content/uploads/2016/07/workshop-participants.jpg',
      //   preview: true,
      // },
      // {
      //   eventId: 10,
      //   url: 'https://www.inspiredbysports.com/wp-content/uploads/2017/08/Kochkurs-gro%C3%9F-1404x936.jpg',
      //   preview: true,
      // },
      // {
      //   eventId: 11,
      //   url: 'https://img.asmedia.epimg.net/resizer/npxy473NmIsao_NQfNUHOdrGmOc=/1472x1104/filters:focal(285x138:295x148)/cloudfront-eu-central-1.images.arcpublishing.com/diarioas/O2KCZHIISFLKXI256J66YQOMQM.jpg',
      //   preview: true,
      // },
      // {
      //   eventId: 12,
      //   url: 'https://freetourcommunity.com/wp-content/uploads/2020/12/free_tour_sf_3.jpg',
      //   preview: true,
      // },
      // {
      //   eventId: 13,
      //   url: 'https://www.nycitywoman.com/wp-content/uploads/2016/11/book-club-725x415.jpg',
      //   preview: true,
      // },
      // {
      //   eventId: 14,
      //   url: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Football_in_Bloomington%2C_Indiana%2C_1996.jpg',
      //   preview: true,
      // },
      // {
      //   eventId: 15,
      //   url: 'https://media.npr.org/assets/img/2022/12/16/gettyimages-1435900516_slide-e6545f2b8dfc4aa1d52828b9cf9495b5740236a0-s1100-c50.jpg',
      //   preview: true,
      // },
      // {
      //   eventId: 16,
      //   url: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0e/5d/52/3d.jpg',
      //   preview: true,
      // },
      // {
      //   eventId: 17,
      //   url: 'https://static01.nyt.com/images/2019/04/20/books/00POWERNICHEBOOKCLUB3/merlin_153693897_740181d2-95c3-4c1b-8c8f-286101f0c279-superJumbo.jpg',
      //   preview: true,
      // },
      // {
      //   eventId: 18,
      //   url: 'https://dynaimage.cdn.cnn.com/cnn/c_fill,g_auto,w_1200,h_675,ar_16:9/https%3A%2F%2Fcdn.cnn.com%2Fcnnnext%2Fdam%2Fassets%2F221126143352-weston-mckennie.jpg',
      //   preview: true,
      // },
      // {
      //   eventId: 1,
      //   url: 'https://goterriers.com/images/2023/9/25/MSOC_UML_Aug27th2023027__1_.jpg?width=1200&height=675&mode=crop&format=jpg&quality=80',
      //   preview: true,
      // },
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
