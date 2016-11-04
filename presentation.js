'use strict';

var song;

function resetPage() {
    responsiveVoice.cancel();
    $('.container-fluid #myCarousel').remove();
    $('.container-fluid #apiModal').remove();
    $('.container-fluid #ipsumModal').remove();
    $('audio').remove();
    setupCarousel();
    $('#ipsumModal').modal('hide');
    $('#apiModal').modal('hide');
    setup();
    return;
}

function nextSlide() {
    $('#myCarousel').carousel('next');
    return;
}

function previousSlide() { //we don't use this right now, but it seems like we might need it someday
    $('#myCarousel').carousel('prev');
    return;
}

function setupCarousel() {
    //create Carousel//
    $('.container-fluid').append('<div id="myCarousel" class="carousel slide"><ol class="carousel-indicators"></ol><div class="carousel-inner" role="listbox"></div></div>');
    return;
}

function decorateCarousel() {
    //add left control//
    $('#myCarousel').append('<a class="left carousel-control" href="#myCarousel" data-slide="prev"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></a>');
    //add right control//
    $('#myCarousel').append('<a class="right carousel-control" href="#myCarousel" data-slide="next"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></a>');
    //add Play/Pause button//
    $('#myCarousel').append('<div id="carouselPauseButton"><button id="pausePlayButton" type="button" class="btn btn-warning btn-lg control"><span class="glyphicon glyphicon-pause"></span></button></div>');
    $('#pausePlayButton').click(playPause);
    //add Reset button//
    $('#myCarousel').append('<div id="carouselResetButton"><button id="resetButton" type="button" class="btn btn-primary btn-lg control"><span class="glyphicon glyphicon-remove"></span></button></div>');
    $('#resetButton').click(function() {
        let $button = $('#resetButton');
        buttonLoadStart($button, 'glyphicon-remove');
        setTimeout(resetPage, 500);
        return;
    });
}

function playPause() {
    var $button = $('#pausePlayButton span');
    if ($button.hasClass('glyphicon-play')) {
        $button.removeClass('glyphicon-play');
        $button.addClass('glyphicon-pause');
        $button.closest('button').removeClass('btn-success');
        $button.closest('button').addClass('btn-danger');
        responsiveVoice.resume();
        song.play();
        return;
    } else if ($button.hasClass('glyphicon-pause')) {
        $button.removeClass('glyphicon-pause');
        $button.addClass('glyphicon-play');
        $button.closest('button').removeClass('btn-danger');
        $button.closest('button').addClass('btn-success');
        responsiveVoice.pause();
        song.pause();
        return;
    }
}

function setupImages() {
    var slideIndicator, slideWrapper, slideCaption, slideHead, slideText;
    var images = JSON.parse(sessionStorage.getItem('images'));
    var ipsum = [''].concat(JSON.parse(sessionStorage.getItem('splitIpsum')));
    console.log('you have', images.length, 'images');
    for (let i = 0; i < images.length; i++) {
        //setup the slide itself//
        slideIndicator = '<li data-target="#myCarousel" data-slide-to=' + i + '></li>';
        $('.carousel-indicators').append(slideIndicator);

        //grab ipsum caption//
        slideHead = ipsum[i];

        slideText = '';
        // slideText = images[i].description; //too much info here

        //setup the display image & text//
        slideCaption = '<div class="carousel-caption"><h1 class="text-warning">' + slideHead + '</h1><p>' + slideText + '</p></div>';
        slideWrapper = '<div class="item"><img class=img-responsive src=' + images[i].assets.preview.url + ' alt=' + images[i].image_type + '>' + slideCaption + '</div>';
        $('.carousel-inner').append(slideWrapper);
    }
    $('.carousel-indicators :first-child').addClass('active');
    $('.carousel-inner :first-child').addClass('active');
    $('#myCarousel').carousel({
        wrap: true, //on the off chance we reach the end too soon, keep going
        pause: null, //don't let focus change the status of the slideshow
        interval: 0 //don't move slides unless forced to
    });
    $('#myCarousel').on('slid.bs.carousel', function() {
        responsiveVoice.speak($('#myCarousel').find('.active .carousel-caption h1').text());
    });
    return;
}

function chooseSong() {
  var musicDB = JSON.parse(sessionStorage.getItem('music'));
  let index = Math.floor((Math.random() * musicDB.length));
  console.log('choosing song at index:',index);
  console.log(musicDB[index].description);
  if (musicDB[index].assets.preview_mp3.url) {
    return musicDB[index];
  } else {
    return chooseSong(musicDB);
  }
}

function setupMusic() {
    $('.container-fluid').append('<div class="col-md-12"><audio id="audio"></audio></div>');
    //choose a random song
    let toStream=chooseSong();
    $('audio').append('<span>' + toStream.description + '</span>');
    $('audio').append('<source src="' + toStream.assets.preview_mp3.url + '" type="audio/mpeg">'
  );
    song = Popcorn('#audio');
    return;
}

function setupText() {
  var textStream=sessionStorage.getItem('ipsum');
  console.log(textStream);
}

function beginSlideShow() {
    console.log('song:', song);
    let songLength = song.duration();
    song.volume(1 / 4);

    for (let i = timer; i < (song.duration() - timer); i += timer) {
        song.cue(i, nextSlide);
    }
    //when the song is over, stop reading slides
    song.cue(songLength, function() {
        $('#pausePlayButton span').removeClass('glyphicon-pause');
        $('#pausePlayButton span').addClass('glyphicon-play');
        $('#pausePlayButton span').removeClass('btn-danger');
        $('#pausePlayButton span').addClass('btn-success');
        responsiveVoice.cancel();
    });

    decorateCarousel();
    song.play();
    return;
}

$(function() {
    setupCarousel();
});
