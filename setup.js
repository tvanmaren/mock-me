'use strict';


var category = 'nature'; //default to nature photos&music
var getPage = 1; //only necessary if we're grabbing more than 20 photos

const timer = 5; //move the slides along every five seconds

const watsonURL = "http://g-watson-tristan.herokuapp.com/?text=";

const imageURL = "https://4ec1e4604d0df001e322:e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c@api.shutterstock.com/v2/images/search?image_type=photo&license=commercial&page=" + getPage + "&orientation=horizontal&sort=random&view=full&query=";

const musicURL = "https://4ec1e4604d0df001e322:e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c@api.shutterstock.com/v2/audio/search?query=";

const videoURL = "https://4ec1e4604d0df001e322:e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c@api.shutterstock.com/v2/videos/search?query=";

function buttonLoadStart($button, glyphiconName) {
    $button.html('<span class="glyphicon ' + glyphiconName + ' glyphicon-spin"></span>');
    return;
}

function buttonLoadStop($button, text) {
    $button.html(text);
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
    $.getJSON(imageURL + category, function(data) {
        processData(data, 'images');
        buttonLoadStop($button, 'Crackle!');
    });
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
    $.getJSON(musicURL + category, function(data) {
        processData(data, 'music');
        buttonLoadStop($button, 'Pop!');
    });

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
    $.getJSON(videoURL + category, function(data) {
        processData(data, 'video');
        $(window).on('load', function() {
          //add in a notification: loading slideshow
          //'start slideshow anyway' button?
        buttonLoadStop($button, 'Let\'s Mock!');
        //pass to slideshow here
        $('#apiModal').modal('hide');
        beginSlideShow();
      });
    });
    return;
}

function insertIpsumModal() {
    $('.container-fluid').append(
        '<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" id="ipsumModal"><div class="modal-dialog modal-lg" role = "document" ><div class = "modal-content" ><h1 class="modal-title">Today, I feel like a...</h1><div class ="modal-body"><div class = "container" ><div class = "row" ><div class="col-md-6"><button id = "hipster" class = "btn btn-info btn-lg">Hipster</button></div><div class = "col-md-6"><button id = "skater" class = "btn btn-danger btn-lg disabled">Skater</button></div></div><div class = "row" ><div class = "col-md-6"><button id = "pony" class = "btn btn-info btn-lg">Pony</button></div><div class="col-md-6"><button id = "bacon" class = "btn btn-info btn-lg">Pig</button></div></div><div class = "row" ><div class = "col-md-6"><button id = "dino" class = "btn btn-info btn-lg"> Dino </button> </div><div class = "col-md-6" ><button id = "custom" class = "btn btn-lg white-background text-warning" autocomplete="off">Custom</button></div></div></div></div></div></div></div>');
    return;
}

function insertAPIModal() {
    $('.container-fluid').append(
        '<div class="modal fade bs-example-modal-lg" tabindex="- 1" role="dialog" id="apiModal"><div class = "modal-dialog modal-lg" role = "document"><div class = "modal-content"><h1 class = "modal-title"> Click to fetch each piece of your presentation</h1> <div class="modal-body"><div class = "row" ><div class = "col-md-6" ><button id = "analyze" class = "btn btn-danger btn-lg disabled"> <span class = "glyphicon glyphicon-cog" > </span><div>Crunch Data</div></button></div><div class = "col-md-6"><button id = "video" class = "btn btn-danger btn-lg disabled"><span class = "glyphicon glyphicon-film"></span><div>Clip Video</div></button></div></div><div class="row"><div class = "col-md-2"><span class = "glyphicon glyphicon-arrow-down"></span></div><div class = "col-md-5"></div><div class = "col-md-1" ><span class = "glyphicon glyphicon-arrow-up"></span></div><div class = "col-md-1"></div></div> <div class = "row"><div class = "col-md-4"><button id = "images" class = "btn btn-danger btn-lg disabled"><span class = "glyphicon glyphicon-picture"></span><div>Laminate Images</div></button></div><div class = "col-md-2"><span class = "glyphicon glyphicon-arrow-right"></span></div><div class = "col-md-4"><button id = "music" class = "btn btn-danger btn-lg disabled"><span class = "glyphicon glyphicon-music"></span><div>Pipe Music</div></button></div></div></div></div></div></div>'
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
