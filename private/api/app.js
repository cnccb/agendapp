/**
 * agend'app - api
 * @author     Philippe Breucker
 * @version    0.1 - 2014
 */


/******** initialization *********/

//environement
var env = require('./env/env.js');

//express initialization - handle http request/response
var express = require('express');
var api = require('./api');
//create node app
var app = module.exports = express(); //not sure exactly why module.exports... (see https://github.com/baugarten/node-restful/blob/master/examples/notes/index.js)

/****** app config ***********/
app.use(express.bodyParser());
app.use(express.methodOverride());

/********Routes**************/
app.get('/events', api.getEvents);
app.get('/ical', api.getIcal);

/******** app start ***********/

app.listen(env.api.port);
console.log('agndapp api server - listening on port '+env.api.port);