'use strict';

require('dotenv').config();

const b64=require('btoa');
const express = require('express');
const axios = require('axios');
const WATSON_URL = process.env.WATSON_URL;
const WATSON_PWD = process.env.WATSON_PWD;
const WATSON_USR = process.env.WATSON_USR;
const SHUTTERSTOCK_ID = process.env.SHUTTERSTOCK_ID;
const SHUTTERSTOCK_SECRET = process.env.SHUTTERSTOCK_SECRET;
const SHUTTERSTOCK_HEADERS={headers: {
        "Authorization": "Basic " + b64(`${SHUTTERSTOCK_ID}:${SHUTTERSTOCK_SECRET}`)
        }};

var app = express();

var watson = require('watson-developer-cloud');

var tone_analyzer = watson.tone_analyzer({
  username: WATSON_USR,
  password: WATSON_PWD,
  version: 'v3',
  version_date: '2016-05-19'
});

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");    res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

app.get('/watson', function(req,res){
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

app.get('/images/', function(req,res){
  const getPage = req.query.getPage;
  const category = req.query.category;

  const imageURL = `https://clientID:clientSecret@api.shutterstock.com/v2/images/search?image_type=photo&license=commercial&page=${getPage}&orientation=horizontal&sort=random&view=full&query=${category}`;
  axios.get(imageURL, SHUTTERSTOCK_HEADERS)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/audio/', function(req,res){
  console.log(req.query);
  const category = req.query.category;

  const musicURL = `https://clientID:clientSecret@api.shutterstock.com/v2/audio/search?query=${category}`;
  axios.get(musicURL, SHUTTERSTOCK_HEADERS)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/videos/', function(req,res){
  console.log(req.query);
  const category = req.query.category;

  const videoURL = `https://clientID:clientSecret@api.shutterstock.com/v2/videos/search?query=${category}`;
  axios.get(videoURL, SHUTTERSTOCK_HEADERS)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(process.env.PORT || 3000);
