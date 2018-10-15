const Sequelize = require('sequelize');
require('dotenv').config();

const db =
  process.env.NODE_ENV === 'test'
    ? `${process.env.DB_TEST_DATABASE}`
    : `${process.env.DB_DATABASE}`;
const user =
  process.env.NODE_ENV === 'test'
    ? `${process.env.DB_TEST_USER}`
    : `${process.env.DB_USER}`;
const pass =
  process.env.NODE_ENV === 'test'
    ? `${process.env.DB_TEST_PASS}`
    : `${process.env.DB_PASS}`;
const host =
  process.env.NODE_ENV === 'test'
    ? `${process.env.DB_TEST_HOST}`
    : `${process.env.DB_HOST}`;

const orm = new Sequelize(db, user, pass, {
  host,
  dialect: 'mysql'
});

orm
  .authenticate()
  .then(() => {
    console.log('Connection to DB has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

/* ///////////////////// */
/* MODELS (alphabetized) */
/* ///////////////////// */

const MapChef = orm.define('mapChef', {
  chefId: Sequelize.INTEGER,
  description: Sequelize.TEXT,
  imageUrl: Sequelize.STRING,
  name: Sequelize.STRING,
  username: Sequelize.STRING,
  streetAddress: Sequelize.TEXT,
  city: Sequelize.TEXT,
  stateName: Sequelize.TEXT,
  zip: Sequelize.INTEGER,
  lat: Sequelize.INTEGER,
  lng: Sequelize.INTEGER
});

// // /* //////////////////////////// */
// // /* RELATIONSHIPS (alphabetized) */
// // /* //////////////////////////// */

// // /* ///////////// */
// // /* Create Tables */
// // /* ///////////// */
orm.sync();

exports.connection = orm;
exports.MapChef = MapChef;
