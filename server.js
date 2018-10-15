require('dotenv').config();

/* **** Express modules **** */
const express = require('express');

const app = express();
const morgan = require('morgan');
const axios = require('axios');
const bodyParser = require('body-parser');

/* **** DB Connection modules **** */
const db = require('./database');

/* **** Apply universal middleware **** */
// app.use('/public', express.static(`${__dirname}/../public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(cookieParser());
app.use(morgan({ format: 'dev' }));
// app.use('/graphql', graphqlHTTP({ schema: gqlSchema, graphiql: true }));

app.get('/ms/user/map', (req, res) => {
  const chef = req.query;
  console.log('this is chef from server ln 24', req.query);

  axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${
        chef.streetAddress
      },${chef.city},${chef.stateName}&key=${process.env.MAP_KEY}`
    )
    .then(data => {
      const { lat, lng } = data.data.results[0].geometry.location;
      console.log(lat, lng, chef);
      db.MapChef.findOrCreate({
        where: { chefId: chef.id },
        defaults: {
          chefId: chef.id,
          streetAddress: chef.streetAddress,
          city: chef.city,
          stateName: chef.stateName,
          zip: chef.zip,
          lat,
          lng,
          name: chef.name,
          username: chef.username,
          description: chef.description
        }
      })
        .then(data => {
          console.log('THIS IS THE DATA FROM MAPSERVER LN51', data);
          res.send(data);
        })
        .catch(err => console.log(err));

      // .success(function(user, created) {
      //   console.log(user.values);
      //   res.send(200);
      // })
      // .error(err => console.log(err));
      // res.send({
      //   lat, lng, name: chef.name, description: chef.description,
      // });
    });
});

module.exports = app;
