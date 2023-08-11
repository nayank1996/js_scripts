// ==UserScript==
// @name         Harmony Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds button for Harmony in NASA and Optimus!!!
// @author       nayankjh@
// @match        https://nasadash.aka.corp.amazon.com/*
// @match        https://optimus-prod.aka.amazon.com/assigned
// @match        https://optimus-prod.aka.amazon.com/completed
// @match        https://optimus-prod.aka.amazon.com/cancelled
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
          setTimeout(function(){
            addButton('Harmony Survey', buttonClick);
       },5000);
    function buttonClick() {
    window.open("https://w.amazon.com/bin/view/KMPortal/connection_POC")
    }
    function addButton(text, onclick) {
        let cssObj = {position: 'absolute', top: '23%', right:'0%', 'z-index': 3};
        let childElement = document.createElement('button'), btnStyle = childElement.style
        childElement.id ="ttButton";
        childElement.setAttribute("style","font-size:15px;color:white;letter-spacing: 0.8px;font-weight: 600;border-radius: 0 0 8px 8px;right: 35px;padding: 5px 10px; position: absolute;background-color: #0b8049;cursor:pointer;");
        childElement.style.animation ="blink 1.5s infinite";
        childElement.innerText=text;
        document.body.appendChild(childElement);
        childElement.onclick = onclick;
        Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
    }

})();