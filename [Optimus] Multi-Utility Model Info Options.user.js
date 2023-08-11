// ==UserScript==
// @name         [Optimus] Multi-Utility Model Info Options
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This stores all the intents in a seperate box and counts intents, utterances and slots based on locales.
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
                //console.log(resp);
                let intents = resp.languageModel.intents;
                let intents2 = resp.languageModel;
               //console.log(intents);
                var uttr = [];
                var intentCount = intents.length;
               //console.log(intentCount);
                for(let i=0;i<intents.length;i++){
                    if(intents[i].hasOwnProperty('samples')){
                 for(let j=0;j<intents[i].samples.length;j++){
                  if(intents[i].samples[j] != undefined && intents[i].samples[j] != ""){
                   uttr.push(intents[i].samples[j])
                  };
                 };
                }
                    else{
                    continue;
                    };
                };
                //console.log(uttr);
              let uttrCount = uttr.length;
              var intentGame = [];
                let area = $("#app > section > main > div > div > div > div.ant-row.m-l-lg.m-r-lg.skillDetailArea > div.ant-col.ant-col-6.skillNotesArea > div > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.skillNotes.m-l-lg.m-r-lg > div:nth-child(3) > div.optimus-text-right.m-t-md");
                let intentBox = document.createElement("div");
                intentBox.style.overflow = "scroll";
                for(let i=0;i<intents.length;i++){
                    intentGame.push(intents[i].name);
                    if(intents[i].hasOwnProperty("samples")){
                        var samples0 = intents[i].samples[0];
                    var samples1 = intents[i].samples.length;
                    var spaa = document.createElement("span");
                    spaa.id = "Intent" +i;
                    spaa.style.cursor = "pointer";
                    spaa.style.fontSize = "13px"
                    spaa.style.color="#1890ff";
                    var spaa2 =document.createElement("span");
                    spaa2.id = "UtterCount" +i;
                    spaa2.style.cursor = "pointer";
                    spaa2.style.fontSize = "14px"
                    spaa2.style.color="black";
                    var break1 = document.createElement("br");
                        if(samples0!=undefined){let spaText2 = spaa2.innerText = `=>${samples0} => ${samples1}`;}
                        else{let spaText2 = spaa2.innerText = `=>none`}
                    //=> ${samples1}
                    var spaText = spaa.innerText = `${intents[i].name}`;
                    intentBox.appendChild(spaa);
                    intentBox.appendChild(spaa2);
                    intentBox.appendChild(break1);
                    spaa.onclick = function(){
                    this.style.backgroundColor = "green";
                    this.style.color = "white";
                    };
                    spaa.ondblclick = function(){
                    this.style.backgroundColor = "red";
                    this.style.color = "white";
                    };
                    } else{
                     continue;
                    };
                   };
                var funInt = [];
                //console.log(uttrCount);
                //console.log(intentGame);
                var PreBuiltIntentCount = 0;
                var CustomIntentCount = 0;
                for(let j=0;j<intentGame.length;j++){
                if(intentGame[j].length > 5){
                if(intentGame[j].substr(0,6) == "AMAZON"){
                    PreBuiltIntentCount++;
                    funInt.push(intentGame[j]);
                }else{
                    CustomIntentCount++;
                }
                }
                };
                //console.log(PreBuiltIntentCount);
                //console.log(CustomIntentCount);
                //console.log(arraySetSlot);
                intentCount =(PreBuiltIntentCount + CustomIntentCount);
                //console.log(funInt);
                var head2 = document.querySelector("#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div.m-t-sm > div.skill-info-phrases.m-t-lg");
               var arr = ["AMAZON.CancelIntent","AMAZON.StopIntent","AMAZON.HelpIntent"];
                if(funInt.includes("AMAZON.RepeatIntent")){
                arr.push("AMAZON.RepeatIntent");
                };
               // console.log(arr);
                for(let z =0;z<=arr.length-1;z++){
                var check = document.createElement("div");
                    check.innerText = arr[z];
                    check.style.display = "inline";
                    check.style.boxShadow = "2px 2px 4px black"
                    check.style.marginBottom = "0px";
                    check.style.marginRight = "25px";
                    check.style.fonSize = "18px";
                    check.style.cursor = "pointer";
                    head2.after(check);
                    check.onclick = function(){
                    this.style.backgroundColor = "green";
                    };
                };
                var head = $("#app > section > main > div > div > div > div.skillInfo");
                var data = document.createElement("div");
                data.style.marginLeft = "25px";
                data.style.color = "black";
                data.style.fontSize = "18px";
                data.innerText = `TotalIntents: ${intentCount}` + "<->" + `PreBuiltIntents: ${PreBuiltIntentCount}` + "<->" + `CustomIntent: ${CustomIntentCount}` + "<->" + `Total Utterances : ${uttrCount}`;
                area.after(intentBox);
                head.after(data);
                });
        });
        },10000);
})();