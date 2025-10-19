// ==UserScript==
// @name         animepahe auto player
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Merlyin
// @match        https://animepahe.si/play/*
// @match        https://kwik.cx/e/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animepahe.com
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    let nextEpisodeLink = "";
    let currentEpisodeNumber = "";
    let lastEpisodeNumber = "";
    let progressBar;
    let videoPlayer;
    let continueAutoPlaying;
    let stillOnAnimePaheAndNotOnKwik = true;
    let theButton;

//------------------------------animepahe---------------------------------------\\

    function openTheVideo() {
        window.location.href = document.querySelectorAll('head > script')[1].textContent.split("\n")[3].split('"')[1];
    }

    function getNextEpisode() {
        if(currentEpisodeNumber != lastEpisodeNumber) {
            nextEpisodeLink = document.querySelector('.sequel a').href;
            GM_setValue("nextEp", nextEpisodeLink);
        }
    }

    function getCurrentEpisodeNumber() {
        currentEpisodeNumber = document.querySelector('.episode-menu .active').text;
        GM_setValue("currentEpNum", currentEpisodeNumber);
    }

    function getLastEpisodeNumber() {
        lastEpisodeNumber = document.querySelector('.episode-menu .dropdown-item:last-child').text;
        GM_setValue("lastEpNum", lastEpisodeNumber);
    }

    function getAnimeInfoPage() {
        GM_setValue("animeInfo", document.querySelector('.theatre-info a').href);
    }

//----------------------------------kwik-----------------------------------------\\
    function getVideoAndProgressBar() {
        videoPlayer = document.querySelector('#kwikPlayer');
        progressBar = document.querySelector('input');
        document.querySelector('button[aria-label="Play"]').click();
    }

    function hasItReachedTheEnd() {
        return progressBar.ariaValueNow == progressBar.ariaValueMax && progressBar.ariaValueMax != 0;
    }

    function goToNextVideo() {
        console.log(currentEpisodeNumber + " " + lastEpisodeNumber);
        if(GM_getValue("currentEpNum", "/") != GM_getValue("lastEpNum", "/")) {
            window.location.href = GM_getValue("nextEp", nextEpisodeLink);
        } else {
            window.location.href = GM_getValue("animeInfo", "/");
        }
    }

    function updateButtonText() {
        if(GM_getValue("keepPlaying", true)) {
            theButton.textContent = "Autoplay: On";
        } else {
            theButton.textContent = "Autoplay: Off";
        }
    }

    function onOffButton() {

        theButton = document.createElement("button");
        theButton.style.position = 'absolute';
        theButton.style.zIndex = "50";

        updateButtonText();

        //make button hidden while video is playing
        if(!GM_getValue("stillOnAnimePaheAndNotOnKwik", false)) {
            var interval = setInterval(function() {if(document.querySelector(".plyr--hide-controls") === null) {theButton.hidden = false;} else {theButton.hidden = true;} }, 500);
        }

        theButton.onclick = function() {
            if(GM_getValue("keepPlaying", false)) {

                GM_setValue("keepPlaying", !GM_getValue("keepPlaying", false));
                updateButtonText();
            } else {

                GM_setValue("keepPlaying", !GM_getValue("keepPlaying", false));
                updateButtonText();

                if(GM_getValue("stillOnAnimePaheAndNotOnKwik", false) && (window.location.href.indexOf("animepahe") != -1)) {

                    GM_setValue("stillOnAnimePaheAndNotOnKwik", false);
                    openTheVideo();
                }
            }
        };

        document.body.prepend(theButton);

    }
//---------------------------------runtime-------------------------------------------\\

    function keepPlaying() {
        return GM_getValue("keepPlaying", continueAutoPlaying);
    }

    function startOp() {
        if(window.location.href.indexOf("animepahe") != -1){
            GM_setValue("stillOnAnimePaheAndNotOnKwik", true);
            onOffButton();
            getCurrentEpisodeNumber();
            getLastEpisodeNumber();
            getAnimeInfoPage();
            getNextEpisode();
            if(keepPlaying()) {
                GM_setValue("stillOnAnimePaheAndNotOnKwik", false);
                openTheVideo();
            }
        } else {
            if(!GM_getValue("stillOnAnimePaheAndNotOnKwik", false)) {
                onOffButton();
                getVideoAndProgressBar();
                var interval = setInterval(function() {if(hasItReachedTheEnd() == true) {goToNextVideo()} }, 1000);
            }
        }
    }

    document.body.onkeydown = function(event){
        event = event || window.event;
        var keycode = event.charCode || event.keyCode;
        if(keycode === 'G'.charCodeAt()){
            videoPlayer.plyr.forward(85); }
        if(keycode === 'H'.charCodeAt()){
           alert("You're on " + GM_getValue("currentEpNum", "idk") + " out of " + GM_getValue("lastEpNum", "idk") + "."); }
        if(keycode === 'Q'.charCodeAt()){
            GM_setValue("keepPlaying", !GM_getValue("keepPlaying", false));
            updateButtonText();
            if(window.location.href.indexOf("animepahe") != -1) {
                GM_setValue("stillOnAnimePaheAndNotOnKwik", false);
                openTheVideo();
            }
        }
        if(keycode === 'W'.charCodeAt()){
        alert(GM_getValue("keepPlaying", "idk"));}
    }

    window.onload = startOp();


})();
