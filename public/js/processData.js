"use strict";

function processData(data, source, category) {
    switch (source) {
        case 'tones':
            {
                console.log('toneAnalysis', data);
                console.log('toneLength', data.length);
                try {
                    if (data.sentences_tone.length) {
                        sessionStorage.setItem('sentenceTones', JSON.stringify(data.sentences_tone));
                        sessionStorage.setItem('overallTone', JSON.stringify(data.document_tone.tone_categories));
                        readyNextButton('#analyze', '#images', getShutterStockPhotos);
                        return;
                    } else {
                        console.log('error analyzing--ajax call incomplete\nMaybe you should write better code...');
                        return;
                    }
                } catch (err) {
                    alert('Too tasteless! Try again!\nERROR:', err);
                    return resetPage();
                }
                break;
            }
        case 'images':
            {
                console.log('imageData', data);
                console.log('imageLength', data.length);
                try {
                    if (data.data.length) {
                        localStorage.setItem(('images-' + category), JSON.stringify(data.data)); //long-term, to reduce ajax calls
                        sessionStorage.setItem('images', JSON.stringify(data.data));
                        setupImages();
                        readyNextButton('#images', '#music', getShutterStockMusic);
                        return;
                    } else {
                        console.log('error grabbing photos--ajax call incomplete\nMaybe you should write better code...');
                        return;
                    }
                } catch (err) {
                    console.log('Shutterstock doesn\'t understand you!\nPlease refresh and try again.\nERROR:', err);
                    return;
                }
                break;
            }
        case 'music':
            {
                console.log('musicData', data);
                console.log('musicLength', data.length);
                try {
                    if (data.data.length) {
                        localStorage.setItem(('music-' + category), JSON.stringify(data.data));
                        sessionStorage.setItem('music', JSON.stringify(data.data));
                        setupMusic();
                        readyNextButton('#music', '#video', getShutterStockVideo);
                        return;
                    } else {
                        console.log('error grabbing music--ajax call incomplete\nMaybe you should write better code...');
                        return;
                    }
                } catch (err) {
                    console.log('Shutterstock doesn\'t understand you!\nPlease refresh and try again.\nERROR:', err);
                    return;
                }
                break;
            }
        case 'video':
            {
                console.log('videoData', data);
                console.log('videoLength', data.length);
                try {
                    if (data.data.length) {
                        localStorage.setItem(('video-' + category), JSON.stringify(data.data));
                        sessionStorage.setItem('video', JSON.stringify(data.data));
                        readyNextButton('#video', '#video', getShutterStockVideo);
                        return;
                    } else {
                        console.log('error grabbing videos--ajax call incomplete\nMaybe you should write better code...');
                        return;
                    }
                } catch (err) {
                    console.log('Shutterstock doesn\'t understand you!\nPlease refresh and try again.\nERROR:', err);
                    return;
                }
                break;
            }
        default:
            {
                alert('WHAT THE HELL DO YOU THINK YOU\'RE DOING!??\nSTOP THAT RIGHT NOW!');
                return;
            }
    }
}
