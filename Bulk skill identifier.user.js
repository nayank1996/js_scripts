// ==UserScript==
// @name         Bulk skills Identifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Identifies Bulk skills and provides pop up to set Correct NASA status.
// @author       nayankjh@
// @match        https://optimus-prod.aka.amazon.com/activityList/skill/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    var $ = window.jQuery;
    'use strict';
    var vendorList = ["Ingress Ventures","Amazon.com","Amazon","Dex","Smart Skills","Online Radio","Nickopanther","ENVIé","FastCast DWC-LLC","Santa Clara","WDPR hospitality","Default User","Golem Net srl"]
    //For WFM team please update this vendor list.
    setTimeout(function(){
         let url = window.location.href.split('/');
        let parent = $("#app > section > main > div > div.activityList.p-md.p-r-lg > div:nth-child(3) > h3 > span");
        let skillId = url[5];
        let versionId = url[7].split('?');
        let version = versionId[0];
        let vendor = document.getElementsByClassName("m-r-sm")[0].innerText;
            if(vendorList.includes(vendor)){
            let child = $("<span>").css({"background-color" : "rgb(0, 176, 230)","color":"black","font-size":"16px","margin-left" : "5px","border":"2px solid black"}).html("Bulk Skill Please change your NASA status to Bulk vendor testing before proceeding.");
                 parent.after(child)
                }
     },8000);
})();