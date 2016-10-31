'use strict';
// console.log('Hipster Jesus',$.getJSON('http://hipsterjesus.com/api/', function(data) {
    // $('#content').html( data.text );
// }));

var url1 = 'https://g-watson.herokuapp.com/tone-analyzer/api/v3/tone?version=2016-05-19&text=';

// var text=$.getJSON('http://hipsterjesus.com/api/');
var text="Hallelujah";

console.log(url1);

var USERNAME="d7866d3a-cfa3-419f-89a5-20abd7b7eee5";
var PASSWORD="HebDAFtfkJSb";

// var text = $.ajax({headers: {
  //  "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)},
  // dataType: "json",  url: url1+text});

var text=$.getJSON(url1+text);

console.log(text);

text.done(console.log(this));

// var USERNAME="4ec1e4604d0df001e322";
// var PASSWORD="e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c";
// $.ajaxSetup({
//   headers: {
//       "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
//     }
// });
// console.log('shutterstock photos,', $.getJSON("https://4ec1e4604d0df001e322:e079a0cfeb1147c55ac1d6d1ecaf2561b60def1c@api.shutterstock.com/v2/images/search?query=APPLE"));

$(document).ready(function() {
    $("#ponyButton").click(function() {
        $.getJSON('https://ponyipsum.com/api/?callback=?',
            { 'type':'all-pony', 'paras':'5' },
            function(ponyGoodness) {
                if (ponyGoodness && ponyGoodness.length > 0) {
                    $("#ponyIpsumOutput").html('');
                    for (var i = 0; i < ponyGoodness.length; i++)
                        $("#ponyIpsumOutput").append('<p>' + ponyGoodness[i] + '</p>');
                    $("#ponyIpsumOutput").show();
                }
            });
    });
});
