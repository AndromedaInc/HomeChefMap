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

app.get('/api/user/map', (req, res) => {
  const chef = req.query;
  console.log('this is chef from server ln 65', req.query);

  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${chef.streetAddress},${chef.city},${chef.state}&key=${process.env.MAP_KEY}`)
    .then((data) => {
      const { lat, lng } = data.data.results[0].geometry.location;
      db.MapChef.findOrCreate({ chefId: chef.id, lat, lng, name: chef.name, description: chef.description, })
        .success(function (user, created) {
          console.log(user.values)
          res.send(200)
        })
        .error(err => console.log(err))
      // res.send({
      //   lat, lng, name: chef.name, description: chef.description,
      // });
    });
});

module.exports = app;
