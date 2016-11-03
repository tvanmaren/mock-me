"use strict";

function parseIpsum() {
  var answer=strongestTone(0, JSON.parse(localStorage.getItem('overallTone')));
  return answer;
}

function parseSentences() {
  var text=[];
  var analysis={};
  var sentences=JSON.parse(localStorage.getItem('sentenceTones'));
  //looking at each sentence Watson analyzed
  for (let i=0; i<sentences.length; i++) {
    //find sentence's strongest emotion
    if (sentences[i].tone_categories.length) { //fix for ampersand error
    let sentenceTone=strongestTone(0,sentences[i].tone_categories);
    //split sentence into sets of five words
    let splitText=sentences[i].text.split(' ');
    while (splitText.length>5) {
      text.push(splitText.splice(0, 5).join(' '));
    }
    text.push(splitText.join(' '));
    //index the tone of each five-word set
    for (let i=0; i<text.length; i++) {
      analysis[text[i]]=sentenceTone;
    }
  } else {
    analysis[sentences[i].text]='PBR&B';
  }
  }
  //save the five-word pieces for future use
  localStorage.setItem('splitIpsum',JSON.stringify(Object.keys(analysis)));
  return analysis;
  }

function strongestTone(index, analysis) {
  //analysis can be overallTone or one sentence from sentenceTone
  //index at 0-->emotional tone
  //index at 1-->language tone
  //index at 2-->social tone
  console.log('analyzing tones of',analysis[index]);
  var strongest=[0,'']; //score,tone_id
  for (let tone in analysis[index].tones) {
    if (strongest[0]<analysis[index].tones[tone].score) {
      strongest[0]=analysis[index].tones[tone].score;
      strongest[1]=analysis[index].tones[tone].tone_id;
    }
  }
  return strongest[1];
}
