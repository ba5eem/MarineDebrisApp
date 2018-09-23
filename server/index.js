const express = require('express');
const app  = express();
const accountSid = 'ACcc4e9df94d3dd290d4d0feb4459403ac';
const authToken = '8762ac81261231ba8f0a1144cfe33c7c';
const client = require('twilio')(accountSid, authToken);
const bodyParser = require('body-parser');
const haversine = require('haversine');
const beaches = require('../data/beaches');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const findClosest = start => {
  let closest = 100;
  let location;
  beaches.map(e => {
    let end = {
      latitude: e.lat,
      longitude: e.lon
    };
    let distance = haversine(start,end, { unit: 'mile' });
    if(distance < closest){
      closest = distance;
      location = e.name;
    }
  });

  return location;
};

app.get('/', (req, res) => {
  client.messages
      .create({
         body: 'ola',
         from: '+12017332747',
         to: '+16129982261'
       })
      .then(message => console.log(message.sid))
      .done();
  res.json('ola');
});

app.post('/seal', (req,res) => {
  let obj = req.body;
  let beach = findClosest({latitude: obj.lat, longitude: obj.lon});
  client.messages
      .create({
         body: `Seal spotted near ${beach}, view in map here: https://www.google.com/maps/place/${obj.lat},${obj.lon} `,
         from: '+12017332747',
         to: '+16129982261'
       })
      .then(message => console.log(message.sid))
      .done();

  res.json(200);
})

app.listen(9000);