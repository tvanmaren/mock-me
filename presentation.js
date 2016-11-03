'use strict';

function resetPage() {
    $('body #myCarousel').remove();
    $('audio').remove();
    setupCarousel();
    $('#ipsumModal').modal('hide');
    $('#apiModal').modal('hide');
    setup();
}

function setupCarousel() {
    //create Carousel//
    $('body').append('<div id="myCarousel" class="carousel slide" data-ride="carousel"><ol class="carousel-indicators"></ol><div class="carousel-inner" role="listbox"></div></div>');
    //add left control//
    $('#myCarousel').append('<a class="left carousel-control" href="#myCarousel" data-slide="prev"><span class="icon-prev"></span></a>');
    //add right control//
    $('#myCarousel').append('<a class="right carousel-control" href="#myCarousel" data-slide="next"><span class="icon-next"></span></a>');
    //add Play/Pause button//
    $('#myCarousel').append('<div id="carouselButtons"><button id="pausePlayButton" type="button" class="btn btn-default btn-xl"><span class="glyphicon glyphicon-pause"></span></button></div>');
    $('#pausePlayButton').click(playPause);
    //add Reset button//
    $('#carouselButtons').append('<button id="resetButton" type="button" class="btn btn-default btn-xl"><span class="glyphicon glyphicon-refresh"></span></button>');
    $('#resetButton').click(resetPage);
}

function playPause() {
    var $button = $('#pausePlayButton span');
    if ($button.hasClass('glyphicon-play')) {
        $button.removeClass('glyphicon-play');
        $button.addClass('glyphicon-pause');
        $('#myCarousel').carousel('cycle');
        $('audio').get(0).play();
        return;
    } else if ($button.hasClass('glyphicon-pause')) {
        $button.removeClass('glyphicon-pause');
        $button.addClass('glyphicon-play');
        $('#myCarousel').carousel('pause');
        $('audio').get(0).pause();
        return;
    }
}

function streamImages() {
    var slideIndicator, slideWrapper, slideCaption, slideHead, slideText;
    var images = JSON.parse(localStorage.getItem('images'));
    var ipsum = JSON.parse(localStorage.getItem('splitIpsum'));
    for (let i = 0; i < images.length; i++) {
        //setup the slide itself//
        slideIndicator = '<li data-target="#myCarousel" data-slide-to=' + i + '></li>';
        $('.carousel-indicators').append(slideIndicator);

        //grab ipsum caption//
        slideHead = ipsum[i];

        slideText = '';
        // slideText = images[i].description; //too much info here

        //setup the display image & text//
        slideCaption = '<div class="carousel-caption"><h1>' + slideHead + '</h1><p>' + slideText + '</p></div>';
        slideWrapper = '<div class="item"><img class=img-responsive src=' + images[i].assets.preview.url + ' alt=' + images[i].image_type + '>' + slideCaption + '</div>';
        $('.carousel-inner').append(slideWrapper);
    }
    $('.carousel-indicators :first-child').addClass('active');
    $('.carousel-inner :first-child').addClass('active');
}

function streamMusic() {
    var music = JSON.parse(localStorage.getItem('music'));
    $('body').append('<audio></audio>');
    let index=Math.floor((Math.random() * music.length));
    console.log(index);
    let toStream = music[index];
    $('audio').append('<span>'+toStream.description+'</span>');
    $('audio').append('<source src="' + toStream.assets.preview_ogg.url + '" type="audio/ogg"><source src="' + toStream.assets.preview_mp3.url + '" type="audio/mpeg">');
}

$(function() {
    setupCarousel();
});
