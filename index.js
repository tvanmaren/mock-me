'use strict';

require('dotenv').config();

var express = require('express');
var request = require('request');
var apiServerHost = process.env.API_SERVER_HOST;

var app = express();

var watson = require('watson-developer-cloud');

var tone_analyzer = watson.tone_analyzer({
  "password": process.env.WATSON_PASSWORD,
  "username": process.env.WATSON_USERNAME,
  version: 'v3',
  version_date: '2016-05-19'
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req,res){
  console.log(req.query);
  console.log("tone analyzer");
    tone_analyzer.tone({ text: req.query.text },
    function(err, tone) {
      if (err){
        console.log(err);
      }
      else {
        res.json(tone);
      }
  });
});

app.listen(process.env.PORT || 3000);
