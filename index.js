'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const b64=require('btoa');
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const WATSON_USERNAME = process.env.WATSON_USERNAME;
const WATSON_PASSWORD = process.env.WATSON_PASSWORD;
const SHUTTERSTOCK_ID = process.env.SHUTTERSTOCK_ID;
const SHUTTERSTOCK_SECRET = process.env.SHUTTERSTOCK_SECRET;
const Authorization=`Basic ${b64(SHUTTERSTOCK_ID+':'+SHUTTERSTOCK_SECRET)}`;
const SHUTTERSTOCK_HEADERS={headers: { Authorization }};
// const access_token = process.env.SHUTTERSTOCK_TOKEN;
// const SHUTTERSTOCK_HEADERS = {
//   headers: {
//     "Authorization": "Bearer: " + access_token
//   }
// };

var app = express();

var watson = require('watson-developer-cloud');

var tone_analyzer = watson.tone_analyzer({
  username: WATSON_USERNAME,
  password: WATSON_PASSWORD,
  version: 'v3',
  version_date: '2016-05-19'
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if ('OPTIONS' === req.method) {
    res.send(200);
  }
  else {
    next();
  }
});

app.use(express.static('./public'));

app.get('/ipsum/:type', function (req, res) {
  const type = req.params.type;

  const ipsumDict = {
    hipster: 'http://hipsterjesus.com/api/?type=hipster-centric',
    pony: 'http://ponyipsum.com/api/?type=all-pony',
    dino: 'http://dinoipsum.herokuapp.com/api/?format=json&paragraphs=5',
    skater: 'http://skateipsum.com/get/5/0/JSON/',
    pig: 'https://baconipsum.com/api/?type=just-meat'
  };

  axios.get(ipsumDict[type], {
      headers: {
        "responseType": "json"
      }
    })
    .then((result) => {
      res.json(result.data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/watson/', function (req, res) {
  console.log('watson query:', req.query);
  console.log("tone analyzer");
  tone_analyzer.tone({
      text: req.query.text
    },
    function (err, tone) {
      if (err) {
        console.log(err);
      } else {
        res.json(tone);
      }
    });
});

app.get('/images/', function (req, res) {
  const getPage = req.query.getPage;
  const category = req.query.category;

  axios.defaults.headers.common['Authorization'] = (Authorization);
  const imageURL = `https://api.shutterstock.com/v2/images/search`;
  axios.get(imageURL, querystring.stringify({
      'image_type': 'photo',
      'license': 'commercial',
      'orientation': 'horizontal',
      'sort': 'random',
      'view': 'full',
      'page': getPage,
      'query': category
    }))
    .then((result) => {
      res.json(result.data);
    })
    .catch((err) => {
      console.log('ERROR:', err);
    });
});

app.get('/audio/', function (req, res) {
  const category = req.query.category;

  axios.defaults.headers.common['Authorization'] = (Authorization);
  const musicURL = `https://api.shutterstock.com/v2/audio/search?query=${category}`;
  axios.get(musicURL)
    .then((result) => {
      res.json(result.data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/video/', function (req, res) {
  const category = req.query.category;

  axios.defaults.headers.common['Authorization'] = (Authorization);
  const videoURL = `https://api.shutterstock.com/v2/videos/search?query=${category}`;
  axios.get(videoURL)
    .then((result) => {
      res.json(result.data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(process.env.PORT || 3000);
