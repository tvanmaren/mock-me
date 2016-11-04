'use strict';

var category = 'nature'; //default to nature photos&music
var getPage = 1; //only necessary if we're grabbing more than 20 photos

const timer = 5; //move the slides along every five seconds

const watsonURL = "https://g-watson-tristan.herokuapp.com/?text=";

const imageURL = "https://4ec1e4604d0df001e322:e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c@api.shutterstock.com/v2/images/search?image_type=photo&license=commercial&page=" + getPage + "&orientation=horizontal&sort=random&view=full&query=";

const musicURL = "https://4ec1e4604d0df001e322:e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c@api.shutterstock.com/v2/audio/search?query=";

const videoURL = "https://4ec1e4604d0df001e322:e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c@api.shutterstock.com/v2/videos/search?query=";

function buttonLoadStart($button, glyphiconName) {
    $button.find('span').addClass('glyphicon-spin');
    return;
}

function buttonLoadStop($button, text) {
    $button.find('span').removeClass('glyphicon-spin');
    $button.find('div').text(text);
    $button.removeClass('btn-success');
    $button.addClass('btn-default');
    return;
}

function getWatsonInfo() {
    var $button = $('#analyze');
    //check if button is disabled or not
    if ($button.hasClass('disabled')) {
        console.log('button disabled');
        return;
    } else {
        buttonLoadStart($button, 'glyphicon-cog');
    }
    var ipsumText = sessionStorage.getItem('ipsum');
    //Watson getJSON goes here
    $.getJSON(watsonURL + ipsumText, function(data) {
        processData(data, 'tones');
        buttonLoadStop($button, 'Snap!');
        return;
    });
    return;
}

function getShutterStockPhotos() {
    var $button = $('#images');
    //check if button is disabled or not
    if ($button.hasClass('disabled')) {
        console.log('button disabled');
        return;
    } else {
        buttonLoadStart($button, 'glyphicon-picture');
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
    if (localStorage.getItem(('images-' + category)) === null) {
        $.getJSON(imageURL + category, function(data) {
            processData(data, 'images', category);
            buttonLoadStop($button, 'Crackle!');
            return;
        });
    } else {
        let data = {};
        data.data = JSON.parse(localStorage.getItem(('images-' + category)));
        processData(data, 'images', category);
        buttonLoadStop($button, 'Crackle!');
    }
    return;
}

function getShutterStockMusic() {
    var $button = $('#music');
    //check if button is disabled or not
    if ($button.hasClass('disabled')) {
        console.log('button disabled');
        return;
    } else {
        buttonLoadStart($button, 'glyphicon-music');
    }
    //PARSE Watson data for category here
    // category = parseIpsum();
    console.log('grabbing', category, 'music');
    //PARSE Watson data for category here
    if (localStorage.getItem(('music-' + category)) === null) {
        $.getJSON(musicURL + category, function(data) {
            processData(data, 'music', category);
            buttonLoadStop($button, 'Pop!');
            return;
        });
    } else {
        let data = {};
        data.data = JSON.parse(localStorage.getItem(('music-' + category)));
        processData(data, 'music', category);
        buttonLoadStop($button, 'Pop!');
    }
    return;
}

function getShutterStockVideo() {
    var $button = $('#video');
    //check if button is disabled or not
    if ($button.hasClass('disabled')) {
        return;
    } else {
        buttonLoadStart($button, 'glyphicon-film');
    }
    //PARSE Watson data for category here
    // category = parseIpsum();
    console.log('grabbing', category, 'videos');
    //PARSE Watson data for category here
    if (localStorage.getItem(('video-'+category))===null) {
    $.getJSON(videoURL + category, function(data) {
        processData(data, 'video', category);
        // $(window).on('load', function() {
        //add in a notification: loading slideshow
        //'start slideshow anyway' button?
        setTimeout(function() {
            buttonLoadStop($button, 'Let\'s Mock!');
            //pass to slideshow here
            $('#apiModal').modal('hide');
            beginSlideShow();
            return;
        }, 100);
        return;
        // });
    });
  } else {
    let data = {};
    data.data = JSON.parse(localStorage.getItem(('video-' + category)));
    processData(data, 'video', category);
    buttonLoadStop($button, 'Let\'s Mock!');
    setTimeout(function() {
        buttonLoadStop($button, 'Let\'s Mock!');
        //pass to slideshow here
        $('#apiModal').modal('hide');
        beginSlideShow();
        return;
    }, 100);
  }
    return;
}

function insertIpsumModal() {
    $('.container-fluid').append('<div class="modal fade bs-example-modal-md" tabindex="-1" role="dialog" id="ipsumModal"><div class="modal-dialog modal-md" role="document"><div class="modal-content"><h2 class="modal-title text-center">Today, I feel like a...</h2><div class="modal-body"><div class="text-center center-block"><div class="row"><div class="btn-group btn-group-vertical"><button id="hipster" class="btn btn-info btn-lg">Hipster</button><button id="pony" class="btn btn-info btn-lg">Pony</button><button id="dino" class="btn btn-info btn-lg">Dino</button></div><div class="btn-group btn-group-vertical"><button class="btn btn-link btn-block"></button><button class="btn btn-link"></button><button class="btn btn-link"></button></div><div class="btn-group btn-group-vertical"><button id="bacon" class="btn btn-info btn-lg">Pig</button><button id="skater" class="btn btn-danger btn-lg disabled">Skater</button><button id="custom" class="btn btn-lg btn-block white-background text-warning" autocomplete="off">Customizer</button></div></div></div></div></div></div></div>');
    return;
}

function insertAPIModal() {
    $('.container-fluid').append(
        '<div class="modal fade bs-example-modal-md" tabindex="- 1" role="dialog" id="apiModal"><div class="modal-dialog modal-md" role="document"><div class="modal-content"><h2 class="modal-title text-center">Click to fetch your presentation</h2><div class="modal-body"><div class="text-center center-block"><div class="btn-group btn-group-vertical"><button id="analyze" class="btn btn-danger btn-lg disabled process"><span class="glyphicon glyphicon-cog"></span><div>Crunch Data</div></button><button class="btn btn-link process"><span class="glyphicon glyphicon-arrow-down"></span></button><button id="images" class="btn btn-danger btn-lg disabled process"><span class = "glyphicon glyphicon-picture"></span><div>Laminate Images</div></button></div><div class="btn-group btn-group-vertical"><button class="btn btn-link process"></button><button class="btn btn-link process"></button><button class="btn btn-link process"><span class="glyphicon glyphicon-arrow-right"></span></button></div><div class="btn-group btn-group-vertical"><button id="video" class="btn btn-danger btn-lg disabled process"><span class = "glyphicon glyphicon-film"></span><div>Clip Video</div></button><button class="btn btn-link process"><span class="glyphicon glyphicon-arrow-up"></span></button><button id="music" class="btn btn-danger btn-lg disabled process"><span class = "glyphicon glyphicon-music"></span><div>Pipe Music</div></button></div></div></div></div></div></div>'
    );
    return;
}

function setup() {
    //insert any js page styling & setup here//
    insertIpsumModal();
    insertAPIModal();
    $('#ipsumModal').modal(options); //displaying the ipsum modal
    $('#ipsumModal').click(getIpsum); //listening for all ipsum buttons
    return;
}

//Run this once the DOM is ready
$(function() {
    setup();
});
