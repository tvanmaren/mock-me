"use strict";

var captionSize = 5; //default to five words per slide

function parseIpsum() {
    var answer = strongestTone(0, JSON.parse(sessionStorage.getItem('overallTone')));
    return answer;
}

function parseSentences() {
    var text = [];
    var analysis = {};
    var sentences = JSON.parse(sessionStorage.getItem('sentenceTones'));
    //looking at each sentence Watson analyzed//
    for (let i = 0; i < sentences.length; i++) {
        console.log('finding emotion of', sentences[i].text);
        //find sentence's strongest emotion//
        try {
            let sentenceTone = strongestTone(0, sentences[i].tone_categories);
            //split sentence into sets of captions//
            let splitText = sentences[i].text.split(' ');
            while (splitText.length > captionSize) {
                text.push(splitText.splice(0, captionSize).join(' '));
            }
            text.push(splitText.join(' '));
            //index the tone of each caption//
            for (let i = 0; i < text.length; i++) {
                analysis[text[i]] = sentenceTone;
            }
        } catch (err) {
            console.log('error in ipsum data! autocorrecting', err);
            analysis[sentences[i].text] = err;
        }
    }
    //save the five-word pieces for future use//
    sessionStorage.setItem('splitIpsum', JSON.stringify(Object.keys(analysis)));
    return analysis;
}

function strongestTone(index, analysis) {
    console.log('analyzing strongestTone:', analysis);
    //analysis can be overallTone or one sentence from sentenceTone
    //index at 0-->emotional tone
    //index at 1-->language tone
    //index at 2-->social tone
    console.log('analyzing tones of', analysis[index]);
    var strongest = [0, '']; //score,tone_id
    for (let tone in analysis[index].tones) {
        if (strongest[0] < analysis[index].tones[tone].score) {
            strongest[0] = analysis[index].tones[tone].score;
            strongest[1] = analysis[index].tones[tone].tone_id;
        }
    }
    return strongest[1];
}
