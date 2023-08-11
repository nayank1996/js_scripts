// ==UserScript==
// @name         [Bodhi] Pre-built intent highlighter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlights pre built intents
// @author       nayankjh@
// @match        https://optimus-prod.aka.amazon.com/skill/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    var $ = window.jQuery;
    'use strict';
    setTimeout(function(){
        let url = window.location.href.split('/');
        let local = $("#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(2) > div.ant-col.ant-col-16 > span:nth-child(3) > div > div > div > div").text();
        let skillId = url[4];
        let version = url[6];
        //console.log(skillId,version,local);
        let url1 = "https://alexaskillcontent-ca-iad.iad.proxy.amazon.com/api/cops-manifests/certification/" +skillId+"?version="+version;
        //console.log(url1);
        $.get(url1, function(data){
          var localInd = Object.keys(data.localizedModelInfo).indexOf(local);
        let modelToken = Object.values(data.localizedModelInfo)[localInd].s3Key;
           // let model1=Object.values(data.localizedModelInfo);
            let url2 = "https://alexaskillcontent-ca-iad.iad.proxy.amazon.com/api/skill/modelInfo/" +modelToken;
            $.get(url2,function(resp){
                let intents = resp.languageModel.intents;
                var funInt = [];
                for(let j=0;j<intents.length;j++){
                if(intents[j].name.substr(0,6) == "AMAZON"){
                   funInt.push(intents[j].name);
                }
                }
                console.log(funInt)
                var head2 = document.querySelector("#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div.m-t-sm > div.skill-info-phrases.m-t-lg");
               var arr = ["AMAZON.CancelIntent","AMAZON.StopIntent","AMAZON.HelpIntent"];
                if(funInt.includes("AMAZON.RepeatIntent")){
                arr.push("AMAZON.RepeatIntent");}
                  if(funInt.includes("AMAZON.FallbackIntent")){
                arr.push("AMAZON.FallbackIntent");}
                     if(funInt.includes("AMAZON.NextIntent")){
                arr.push("AMAZON.NextIntent");}
                if(funInt.includes("AMAZON.PreviousIntent")){
                arr.push("AMAZON.PreviousIntent");}
                if(funInt.includes("AMAZON.StartOverIntent")){
                arr.push("AMAZON.StartOverIntent");
                 }
                let intentBox = document.createElement("div");
                intentBox.style.overflow = "scroll";
                intentBox.style.marginTop = "20px";
             for(let z =0;z<arr.length;z++){
                var check = document.createElement("span");
                    check.innerText = arr[z];
                    //check.style.display = "inline";
                    check.style.boxShadow = "2px 2px 4px black"
                    check.style.marginBottom = "0px";
                    check.style.marginRight = "25px";
                    check.style.fonSize = "18px";
                    check.style.cursor = "pointer";
                    intentBox.append(check);
                }
                head2.after(intentBox)
                })
        });
        },10000);
})();