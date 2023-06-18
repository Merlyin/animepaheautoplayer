// ==UserScript==
// @name         animepahe auto player
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Merlyin
// @match        https://animepahe.com/play/*
// @match        https://kwik.cx/e/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animepahe.com
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let nextEpisodeLink = "";
    let currentEpisodeNumber = "";
    let lastEpisodeNumber = "";
    let progressBar;
    let videoPlayer;
    let continueAutoPlaying;

//------------------------------animepahe---------------------------------------\\
    function clickTheLoadingButton() {
        document.querySelector('.click-to-load').click();
    }

    function openTheVideo() {
        window.location.href = document.querySelector('.embed-responsive-item').src;
    }

    function getNextEpisode() {
        if(currentEpisodeNumber != lastEpisodeNumber) {
            nextEpisodeLink = document.querySelector('.sequel a').href;
            console.log(nextEpisodeLink);
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
        document.querySelector('button[aria-label="Play"]').click()
    }

    //function makeItFullScreen() { document.querySelector("button[data-plyr='fullscreen']").click(); }

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
        //window.location.href = nextEpisodeLink;
        //console.log("hello");
        //console.log(nextEpisodeLink);
    }
//---------------------------------runtime-------------------------------------------\\

    function keepPlaying() {
        //GM_setValue("keepPlaying", false);
        return GM_getValue("keepPlaying", continueAutoPlaying);
    }

    function startOp() {
        console.log("hello from the outside of the if");
        if(window.location.href.indexOf("animepahe") != -1){
            console.log("hello from the place you thought you were in");
            clickTheLoadingButton();
            getCurrentEpisodeNumber();
            getLastEpisodeNumber();
            getAnimeInfoPage();
            getNextEpisode();
            if(keepPlaying()) {
                openTheVideo();
            }
        } else {
            getVideoAndProgressBar();
            console.log("hello from the place you thought you weren't going to reach " + window.location.href);
            //getAndStartVideo();
            //makeItFullScreen();
            //console.log("hi");
            var interval = setInterval(function() {if(hasItReachedTheEnd() == true) {goToNextVideo()} }, 1000);
        }
    }
    document.body.onkeydown = function(event){
        event = event || window.event;
        var keycode = event.charCode || event.keyCode;
        if(keycode === 'G'.charCodeAt()){
            videoPlayer.plyr.forward(85); }
        if(keycode === 'H'.charCodeAt()){
           alert("howdy there, current episode is... " + GM_getValue("currentEpNum", "idk") + " out of " + GM_getValue("lastEpNum", "idk")); }
        if(keycode === 'Q'.charCodeAt()){
            GM_setValue("keepPlaying", !GM_getValue("keepPlaying", false));
            if(window.location.href.indexOf("animepahe") != -1) {
                openTheVideo();
            }
        }
        if(keycode === 'W'.charCodeAt()){
        alert(GM_getValue("keepPlaying", "idk"));}
    }

    window.onload = startOp();


})();
