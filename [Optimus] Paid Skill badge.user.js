// ==UserScript==
// @name         [Optimus] Paid Skill badge
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  get the product associated with paid skill
// @author       nayankjh@
// @match        https://optimus-prod.aka.amazon.com/skill/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==
var $ = window.jQuery;
(function() {
    'use strict';
    setTimeout(function(){
        let url = window.location.href.split('/');
       let skillId = url[4];
        let version = url[6];
        let url1 = "https://alexaskillcontent-ca-iad.iad.proxy.amazon.com/api/cops-manifests/certification/" +skillId+"?version="+version;
    $.get(url1, function(data){
          // console.log(data);
        var paidData = data.skillManifest.skillManifestFeatures.publishingInformation.paidSkillInformation.pricing["amazon.com"][0].offerType;
        var child = $("<span>").css({"margin-right": "0.5rem","font-size" : "14px","line-height": "1.5","padding": "0.1rem 0.8rem","border": "1px solid transparent","border-radius": "1.4rem","border-color": "rgb(0, 130, 150)"});
        child.html("PAID-"+paidData);
        var parent = $("#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div.m-t-sm > div:nth-child(2) > div:nth-child(2)")
        parent.after(child);
        if(paidData == "SUBSCRIPTION"){
         let freq = data.skillManifest.skillManifestFeatures.publishingInformation.paidSkillInformation.pricing["amazon.com"][0].subscriptionInformation.subscriptionPaymentFrequency;
        var child1 = $("<span>").css({"margin-right": "0.5rem","font-size" : "14.5px","line-height": "1.5","padding": "0.1rem 0.8rem","border": "1px solid transparent","border-radius": "1.4rem","border-color": "rgb(0, 130, 150)"});
        child1.html("Period:"+freq);
        };
           });
    },7000);
})();