"use strict";

const options = {
    backdrop: 'static',
    keyboard: false
};

var ipsumURL = 'http://hipsterjesus.com/api/?type=hipster-centric'; //default to hipsterIpsum

function readyNextButton(sourceID, destinationID, destinationClickFunction) {
  $(sourceID).addClass('disabled');
  $(destinationID).removeClass('btn-danger');
  $(destinationID).addClass('btn-success');
  $(destinationID).removeClass('disabled');
  $(destinationID).click(destinationClickFunction);
  return;
}

function getIpsum(event) {
    var ipsum = $(event.target).text();
    console.log('ipsum is',ipsum);
    switch (ipsum) {
        case 'Hipster':
            {
                ipsumURL = 'http://hipsterjesus.com/api/?type=hipster-centric';
                $.getJSON(ipsumURL, function(hipsterGoodness) {
                    if (hipsterGoodness.text.length) {
                        sessionStorage.setItem('ipsum', encodeURIComponent($(hipsterGoodness.text).text())); //necessary to avoid ampersand issues
                        $('#ipsumModal').modal('hide');
                        $('#apiModal').modal(options);
                        readyNextButton('#analyze','#analyze', getWatsonInfo);
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
                  sessionStorage.setItem('ipsum', ponyGoodness.join(' '));
                  $('#ipsumModal').modal('hide');
                  $('#apiModal').modal(options);
                  readyNextButton('#analyze','#analyze', getWatsonInfo);
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
                  sessionStorage.setItem('ipsum', dinoGoodness);
                  $('#ipsumModal').modal('hide');
                  $('#apiModal').modal(options);
                  readyNextButton('#analyze','#analyze', getWatsonInfo);
              }
          });
          break;
        }
        case 'Skater': //not currently working due to CORS issues
        {
        //   ipsumURL='http://skateipsum.com/get/5/0/JSON/'; //has CORS issues for now
        //   $.getJSON(ipsumURL, function(skaterGoodness) {
        //     console.log(skaterGoodness);
        //       if (skaterGoodness) {
        //         skaterGoodness=skaterGoodness.map(function(array) {return array.map(function(element) {return element;}).join(' ');}).join('. ');
        //         skaterGoodness+='.';
        //         console.log(skaterGoodness);
        //           sessionStorage.setItem('ipsum', skaterGoodness);
        //           $('#ipsumModal').modal('hide');
        //           $('#apiModal').modal(options);
        //           readyNextButton('#analyze','#analyze', getWatsonInfo);
        //       }
        //   });
          break;
        }
        case 'Pig':
        {
          ipsumURL='https://baconipsum.com/api/?type=just-meat';
          $.getJSON(ipsumURL, function(baconGoodness) {
            console.log(baconGoodness);
            baconGoodness=baconGoodness.join('');
              if (baconGoodness) {
                  sessionStorage.setItem('ipsum', baconGoodness);
                  $('#ipsumModal').modal('hide');
                  $('#apiModal').modal(options);
                  readyNextButton('#analyze','#analyze', getWatsonInfo);
              }
          });
          break;
        }
        case 'Custom':
        {
          sessionStorage.setItem('ipsum',encodeURIComponent(prompt('please enter your ipsum:')));
          $('#ipsumModal').modal('hide');
          $('#apiModal').modal(options);
          readyNextButton('#analyze','#analyze', getWatsonInfo);
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
