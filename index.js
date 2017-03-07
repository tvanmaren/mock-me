'use strict';

require('dotenv').config();

const express = require('express');
const axios = require('axios');
const WATSON_URL = "https://gateway.watsonplatform.net/tone-analyzer/api";
const WATSON_PWD = "bQ4ws7wCgfFC";
const WATSON_USR = "34d65e1a-374f-4ca4-8a99-1f535a9c33e4";

const musicURL = "https://clientID:clientSecret@api.shutterstock.com/v2/audio/search?query=";

const videoURL = "https://clientID:clientSecret@api.shutterstock.com/v2/videos/search?query=";

var app = express();

var watson = require('watson-developer-cloud');

var tone_analyzer = watson.tone_analyzer({
  username: WATSON_USR,
  password: WATSON_PWD,
  version: 'v3',
  version_date: '2016-05-19'
});
console.log(tone_analyzer);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
  console.log(req.query);
  const getPage = req.query.getPage;
  const category = req.query.category;
  const imageURL = `https://clientID:clientSecret@api.shutterstock.com/v2/images/search?image_type=photo&license=commercial&page=${getPage}&orientation=horizontal&sort=random&view=full&query=${category}`;
  axios.get(imageURL)
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
  axios.get(musicURL)
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
  axios.get(videoURL)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(process.env.PORT || 3000);
