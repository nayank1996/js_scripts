// ==UserScript==
// @name         [Optimus]Language_Validator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Validates the avalible language for skill with skill's present locales.
// @author       nayankjh@
// @match        https://optimus-prod.aka.amazon.com/skill/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    var $ = window.jQuery;
    'use strict';

    setTimeout(function(){
    let url = window.location.href.split('/');
         let skillId = url[4];
        let version = url[6];
        let url1 = "https://alexaskillcontent-ca-iad.iad.proxy.amazon.com/api/cops-manifests/certification/" +skillId+"?version="+version;
     var parent = $("#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(1) > div.ant-col.ant-col-16 > div:nth-child(1) > span")
        console.log(url1)
       $.get(url1, function(data){
           var locales = data.enrichment.locales
               var locales1 = [];
               for(var i=0;i<locales.length;i++){
               locales1.push(locales[i].split('-')[1]);
               }
           var res = data.enrichment.excludedCountries;
           if(res.length ==0){
               let availSpan2= $("<span>").css({"background-color" : "green","color":"white","font-size" : "14px","margin-left" : "15px"}).html("PASS no country restrictions")
         parent.after(availSpan2)
           }else{
               var restri =[]
               var restLocales1=[]
               var restLocales = document.querySelector("#app > section > main > div > div > div > div.ant-row.m-l-lg.m-r-lg.skillDetailArea > div.ant-col.ant-col-18.skillInformationArea.p-r-lg > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div:nth-child(2) > div.ant-table-wrapper.twoColLayout > div > div > div > div.ant-table-content > div > table > tbody > tr:nth-child(1) > td.colAlignment.optimus-text-wordbreak-word").innerText.split(',');
               for(var n=1;n<restLocales.length;n++){
               restLocales1.push(restLocales[n].substring(1))
               }
               for(var z=0;z<locales1.length;z++){
               if(restLocales1.includes(locales1[z])){
               restri.push(locales1[z])
               }
               }
               if(restri.length == 0){
                    let availSpan3= $("<span>").css({"background-color" : "green","color":"white","font-size" : "14px","margin-left" : "25px"}).html("PASS No locales present restricted!!!!!")
         parent.after(availSpan3)
               }else{let availSpan4= $("<span>").css({"background-color" : "red","color":"white","font-size" : "14px","margin-left" : "25px"}).html("FAIL below locale are restricted!!!!\n("+restri+")")
         parent.after(availSpan4)
           }
           }
           var available = data.skillManifest.skillManifestFeatures.publishingInformation.isAvailableWorldwide;
           if(available){
         let availSpan= $("<span>").css({"background-color" : "green","color":"white","font-size" : "14px","margin-left" : "25px"}).html("PASS Skill is available for All languages where alexa is present!!!")
          parent.after(availSpan)
          } else {
               var bool = true;
               var notAvailable = data.skillManifest.skillManifestFeatures.publishingInformation.distributionCountries;
               var notAvail = [];
               for(var j=0;j<locales1.length;j++){
               if(!notAvailable.includes(locales1[j])){
               notAvail.push(locales1[j])
               }
              }
               if(notAvail.length == 0){
                    let availSpan1= $("<span>").css({"background-color" : "green","color":"white","font-size" : "14px","margin-left" : "25px"}).html("PASS  All locales are present in Available Languages!!!!!")
         parent.after(availSpan1)
               }else{let availSpan= $("<span>").css({"background-color" : "red","color":"white","font-size" : "14px","margin-left" : "25px"}).html("FAIL below locale are not present in Available Language!!!!\n("+notAvail+")")
         parent.after(availSpan)
                    }
           }
       })
    },5000)
})();
