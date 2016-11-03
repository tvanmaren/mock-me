'use strict';


var category = 'nature'; //default to nature photos&music
var ipsumURL = 'http://hipsterjesus.com/api/?type=hipster-centric'; //default to hipsterIpsum
const options = {
    backdrop: 'static',
    keyboard: false
};
const watsonURL = "http://g-watson-tristan.herokuapp.com/?text=";
const imageURL = "https://4ec1e4604d0df001e322:e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c@api.shutterstock.com/v2/images/search?image_type=photo&license=commercial&orientation=horizontal&sort=popular&view=full&query=";

const musicURL = "https://4ec1e4604d0df001e322:e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c@api.shutterstock.com/v2/audio/search?query=";
const videoURL = "https://4ec1e4604d0df001e322:e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c@api.shutterstock.com/v2/videos/search?query=";

function getIpsum(event) {
    var ipsum = $(event.target).text();
    console.log('ipsum is',ipsum);
    switch (ipsum) {
        case 'Hipster':
            {
                ipsumURL = 'http://hipsterjesus.com/api/?type=hipster-centric';
                $.getJSON(ipsumURL, function(hipsterGoodness) {
                    if (hipsterGoodness.text.length) {
                        localStorage.setItem('ipsum', hipsterGoodness.text);
                        $('#ipsumModal').modal('hide');
                        $('#apiModal').modal(options);
                        $('#analyze').removeClass('disabled');
                    }
                });
                break;
            }
        case 'Pony':
        {
          ipsumURL='http://ponyipsum.com/api/?type=all-pony';
          $.getJSON(ipsumURL, function(ponyGoodness) {
            console.log(ponyGoodness);
              if (ponyGoodness) {
                  localStorage.setItem('ipsum', ponyGoodness.join(' '));
                  $('#ipsumModal').modal('hide');
                  $('#apiModal').modal(options);
                  $('#analyze').removeClass('disabled');
              }
          });
          break;
        }
        case 'Dino':
        {
          ipsumURL='http://dinoipsum.herokuapp.com/api/?format=json&paragraphs=5';
          $.getJSON(ipsumURL, function(dinoGoodness) {
            console.log(dinoGoodness);
              if (dinoGoodness) {
                dinoGoodness=dinoGoodness.map(function(array) {return array.map(function(element) {return element;}).join(' ');}).join('. ');
                dinoGoodness+='.';
                captionSize=3;
                console.log(dinoGoodness);
                  localStorage.setItem('ipsum', dinoGoodness);
                  $('#ipsumModal').modal('hide');
                  $('#apiModal').modal(options);
                  $('#analyze').removeClass('disabled');
              }
          });
          break;
        }
        default:
            {
                console.log('you didn\'t choose an ipsum');
                return;
            }
    }
    $('#analyze').click(getWatsonInfo);
    return;
}

function getWatsonInfo() {
    if ($('#analyze').hasClass('disabled')) {
        console.log('button disabled');
        return;
    } else {
        $('#analyze').addClass('disabled');
    }
    var text = localStorage.getItem('ipsum');
    //Watson getJSON goes here
    $.getJSON(watsonURL + text, function(toneAnalysis) {
        console.log('toneAnalysis', toneAnalysis);
        try {
        if (toneAnalysis.sentences_tone.length) {
            localStorage.setItem('sentenceTones', JSON.stringify(toneAnalysis.sentences_tone));
            localStorage.setItem('overallTone', JSON.stringify(toneAnalysis.document_tone.tone_categories));
            $('#images').removeClass('disabled');
            $('#images').click(getShutterStockPhotos);
            return;
        }
      }
      catch(err) {
        alert('Too tasteless! Try again!');
        resetPage();
      }
    });
    //Then enable listener for getShutterStockPhotos

    return;
}

function getShutterStockPhotos() {
    //check if button is disabled or not
    if ($('#images').hasClass('disabled')) {
        console.log('button disabled');
        return;
    } else {
        $('#images').addClass('disabled');
    }
    //PARSE Watson data for category here
    console.log(parseSentences());
    category = parseIpsum();
    console.log('grabbing', category, 'photos');
    //PARSE Watson data for category here
    var USERNAME = "4ec1e4604d0df001e322";
    var PASSWORD = "e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c";
    $.ajaxSetup({
        headers: {
            "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
        }
    });
    $.getJSON(imageURL + category, function(imageData) {
        if (imageData.data.length) {
            localStorage.setItem('images', JSON.stringify(imageData.data));
            $('#music').removeClass('disabled');
            streamImages();
            $('#music').click(getShutterStockMusic);
            return;
        }
    });
    //Enable listener for getShutterStockMusic
}

function getShutterStockMusic() {
    //check if button is disabled or not
    if ($('#music').hasClass('disabled')) {
        return;
    } else {
        $('#music').addClass('disabled');
    }
    //PARSE Watson data for category here
    category = parseIpsum();
    console.log('grabbing', category, 'music');
    //PARSE Watson data for category here
    $.getJSON(musicURL + category, function(musicData) {
        if (musicData.data.length) {
            localStorage.setItem('music', JSON.stringify(musicData.data));
            $('#video').removeClass('disabled');
            streamMusic();
            $('#video').click(getShutterStockVideo);
            return;
        }
    });
    //Then enable listener for getShutterStockVideo

}

function getShutterStockVideo() {
    //check if button is disabled or not
    if ($('#video').hasClass('disabled')) {
        return;
    } else {
        $('#video').addClass('disabled');
    }
    //PARSE Watson data for category here
    category = parseIpsum();
    console.log('grabbing', category, 'videos');
    //PARSE Watson data for category here
    $.getJSON(videoURL + category, function(videoData) {
        if (videoData.data.length) {
            localStorage.setItem('video', JSON.stringify(videoData.data));
            $('#apiModal').modal('hide');
            //pass to slideshow here
            setTimeout(function() {
                $('#myCarousel').carousel({
                    interval: 3000,
                    pause: false
                });
            }, 2000);
            return setTimeout(function() {
                $('audio').get(0).play();
            }, 2000);
        }
    });
}

function setup() {
    //insert page styling & setup here//
    $('#ipsumModal').modal(options);
    $('#ipsumModal').click(getIpsum);
    return;
}

//Run this once the DOM is ready
$(function() {
    localStorage.clear();
    setup();
    // $('#ipsumModal').on('hidden.bs.modal', getWatsonInfo); //use this method in order to automate (hide) the watson API call
});
