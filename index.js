'use strict';

require('dotenv').config();

const btoa=require('btoa');
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

  const USERNAME = "4ec1e4604d0df001e322";
  const PASSWORD = "e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c";
  const config={headers: {
          "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
          }};
  const imageURL = `https://clientID:clientSecret@api.shutterstock.com/v2/images/search?image_type=photo&license=commercial&page=${getPage}&orientation=horizontal&sort=random&view=full&query=${category}`;
  axios.get(imageURL, config)
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

  const USERNAME = "4ec1e4604d0df001e322";
  const PASSWORD = "e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c";
  const config={headers: {
          "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
          }};
  const musicURL = `https://clientID:clientSecret@api.shutterstock.com/v2/audio/search?query=${category}`;
  axios.get(musicURL, config)
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

  const USERNAME = "4ec1e4604d0df001e322";
  const PASSWORD = "e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c";
  const config={headers: {
          "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
          }};
  const videoURL = `https://clientID:clientSecret@api.shutterstock.com/v2/videos/search?query=${category}`;
  axios.get(videoURL, config)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(process.env.PORT || 3000);
