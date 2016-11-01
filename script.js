'use strict';


$(function() {
    function getIpsum(event) {
        var ipsum = $(event.target).text();
        switch (ipsum) {
            case 'Hipster':
                {
                    console.log('you\'ve chosen the hipster Ipsum');
                    $.getJSON('http://hipsterjesus.com/api/', function(hipsterGoodness) {
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
    }

    function getWatsonInfo() {
        console.log('ready for Watson!');
        $('#apiModal').modal(options);
        //Watson getJSON goes here
        
        //Then pass to getShutterStockPhotos
    }

    function setup() {
        //insert page styling & setup here//
        $('#setupModal').modal(options);
    }

    //This runs once the DOM is ready
    setup();
    var options = {
        background: 'true',
        keyboard: 'false'
    };
    $('#hipster').click(getIpsum);
    $('#setupModal').on('hidden.bs.modal', getWatsonInfo);
});
