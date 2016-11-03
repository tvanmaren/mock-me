'use strict';


var category = 'nature'; //default to nature photos&music
var getPage=1;

const watsonURL = "http://g-watson-tristan.herokuapp.com/?text=";

const imageURL = "https://4ec1e4604d0df001e322:e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c@api.shutterstock.com/v2/images/search?image_type=photo&license=commercial&page="+getPage+"&orientation=horizontal&sort=random&view=full&query=";

const musicURL = "https://4ec1e4604d0df001e322:e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c@api.shutterstock.com/v2/audio/search?query=";

const videoURL = "https://4ec1e4604d0df001e322:e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c@api.shutterstock.com/v2/videos/search?query=";

function getWatsonInfo() {
    if ($('#analyze').hasClass('disabled')) {
        console.log('button disabled');
        return;
    } else {
        $('#analyze').addClass('disabled');
    }
    var ipsumText = localStorage.getItem('ipsum');
    //Watson getJSON goes here
    $.getJSON(watsonURL + ipsumText, function(toneAnalysis) {
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
            return;
        }
    });
    getPage++;
    $.getJSON(imageURL+category, function(imageData) {
      if (imageData.data.length && localStorage.getItem('images')) {
        let images=JSON.parse(localStorage.getItem('images'));
        console.log(images);
        images=images.concat(imageData.data);
        localStorage.setItem('images', JSON.stringify(images));
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
            var pop=Popcorn('#audio');
            return setTimeout(function() {
                pop.play();
            }, 2000);
        }
    });
}

function setup() {
    //insert page styling & setup here//
    $('#ipsumModal').modal(options); //displaying the ipsum modal
    $('#ipsumModal').click(getIpsum); //listening for buttons
    return;
}

//Run this once the DOM is ready
$(function() {
    localStorage.clear();
    setup();
    // $('#ipsumModal').on('hidden.bs.modal', getWatsonInfo); //use this method in order to automate (hide) the watson API call
});
