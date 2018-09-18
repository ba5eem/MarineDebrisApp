const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const haversine = require('haversine');
const beaches = require('./beachWithCoords');

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

app.post('/seal', (req,res) => {
	let start = {
  	latitude: req.body.lat,
  	longitude: req.body.lon
	}
	let closest = findClosest(start);
	console.log(closest);
	// TODO: send twilio text message alert here
	res.json(200);
})


app.listen(9000);
