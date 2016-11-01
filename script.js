'use strict';


$(function() {
  const options = {
      background: 'false',
      keyboard: 'false'
  };
  const watsonURL="http://g-watson-tristan.herokuapp.com/?text=";
  const ipsumURL="http://hipsterjesus.com/api/"; //probably store this in the function, not here
  const imageURL="https://4ec1e4604d0df001e322:e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c@api.shutterstock.com/v2/images/search?query=";
  const musicURL="https://4ec1e4604d0df001e322:e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c@api.shutterstock.com/v2/audio/search?query=";

    function getIpsum(event) {
        var ipsum = $(event.target).text();
        switch (ipsum) {
            case 'Hipster':
                {
                    console.log('you\'ve chosen the hipster Ipsum');
                    $.getJSON(ipsumURL, function(hipsterGoodness) {
                        if (hipsterGoodness.text.length) {
                            console.log('storing', hipsterGoodness);
                            localStorage.setItem('ipsum', hipsterGoodness.text);
                            console.log('stored', localStorage.getItem('ipsum'));
                            $('#setupModal').modal('hide');
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
        return;
    }

    function getWatsonInfo() {
        console.log('ready for Watson!');
        $('#apiModal').modal(options);
        $('#analyze').toggleClass('disabled');
        var text = localStorage.getItem('ipsum');
        //Watson getJSON goes here
        $.getJSON(watsonURL+text, function(toneAnalysis) {
            if (toneAnalysis.sentences_tone.length) {
                console.log('storing', toneAnalysis);
                localStorage.setItem('sentenceTones', JSON.stringify(toneAnalysis.sentences_tone));
                localStorage.setItem('overallTone', JSON.stringify(toneAnalysis.document_tone.tone_categories));
                console.log('stored sentences', localStorage.getItem('sentenceTones'));
                console.log('stored document', localStorage.getItem('overallTone')
                );
                $('#images').toggleClass('disabled');
            }
        });
        //Then enable listener for getShutterStockPhotos
        $('#images').click(getShutterStockPhotos);
        return;
    }

    function getShutterStockPhotos() {
      //check if button is disabled or not
      if ($('#images').hasClass('disabled')) {
        console.log('button disabled');
        return;
      }
      //parse Watson data for category here
      var category='nature';
      //parse Watson data for category here
      var USERNAME="4ec1e4604d0df001e322";
      var PASSWORD="e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c";
      $.ajaxSetup({
        headers: {
            "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
          }
      });
      $.getJSON(imageURL+category, function (imageData) {
        if (imageData.data.length) {
          console.log('storing',imageData);
          localStorage.setItem('images',JSON.stringify(imageData.data));
          console.log('stored',localStorage.getItem('images'));
          $('#music').toggleClass('disabled');
        }
      });
      //Then enable listener for getShutterStockMusic
      $('#music').click(getShutterStockMusic);
      return;
    }

    function getShutterStockMusic() {
      //check if button is disabled or not
      if ($('#music').hasClass('disabled')) {
        return;
      }
      //parse Watson data for category here
      var category='nature';
      //parse Watson data for category here
      $.getJSON(musicURL+category, function(musicData) {
        if (musicData.data.length) {
          console.log('storing',musicData);
          localStorage.setItem('music',JSON.stringify(musicData.data));
          console.log('stored',localStorage.getItem('music'));
          $('#apiModal').modal('hide');
          //pass to slideshow here
        }
      });
      return;
    }

    function setup() {
        //insert page styling & setup here//
        $('#setupModal').modal(options);
    }

    //Run this once the DOM is ready

    setup();
    $('#hipster').click(getIpsum);
    $('#setupModal').on('hidden.bs.modal', getWatsonInfo);
});
