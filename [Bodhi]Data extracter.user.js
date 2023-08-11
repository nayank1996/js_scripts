// ==UserScript==
// @name         [Bodhi]Data extracter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       nayankjh@
// @match        https://optimus-prod.aka.amazon.com/skill/*
// @match        https://cic.amazon.com/vendor/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    var $ = window.jQuery;
    'use strict';
        const isOptimusProd = /optimus-prod.aka/.test(window.location.href);
        const isCICProd = /cic.amazon/.test(window.location.href);
    if(isOptimusProd){
    setTimeout(function(){
            addButton('Skill details', buttonClick);
       },5000);
    function buttonClick() {
    let url = window.location.href.split('/');
        let skillName = document.querySelector("#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(1) > div.ant-col.ant-col-16 > div:nth-child(1) > span").innerText;
        let skillId = url[4];
        let versionId = url[6];
        let vendor = document.getElementsByClassName("m-r-sm")[0].innerText;
        let optimus = "https://optimus-prod.aka.amazon.com/skill/" + skillId + "/version/" + versionId + "/about?";
        let url1 = "https://alexaskillcontent-ca-iad.iad.proxy.amazon.com/api/cops-manifests/certification/" +skillId+"?version="+versionId;
       let short = document.querySelector("#app > section > main > div > div > div > div.ant-row.m-l-lg.m-r-lg.skillDetailArea > div.ant-col.ant-col-18.skillInformationArea.p-r-lg > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.aboutTab > div:nth-child(1) > div > div > div > div > div.ant-table-content > div > table > tbody > tr:nth-child(1) > td.colAlignment.optimus-text-wordbreak-word > div").innerText;
        $.get(url1, function(data){
            var locale = Object.keys(data.skillManifest.skillManifestFeatures.publishingInformation.locales)
            var temp = document.createElement("textarea");
                document.body.appendChild(temp);
                    temp.value = `Assignee name: \nSkill Details:\nSkill name: ${skillName}\nSkill ID: ${skillId}\nOptimus link : ${optimus}\nSkill short description: ${short}\nSkill Version number: ${versionId}\nAvailable Locales :  ${locale}\nSubject : Exclusive feedback from in-house experts for your ${skillName} skill \nRecommendations:`
                    temp.select();
                    document.execCommand('copy');
                    temp.remove();
                 var vendorId = data.enrichment.vendorCode;
            window.open("https://cic.amazon.com/vendor/search.html?searchString="+vendorId)
        })
      alert("Data extracted")
    }
    function addButton(text, onclick) {
        let cssObj = {position: 'absolute', top: '16%', right:'20.65%', 'z-index': 3};
        let childElement = document.createElement('button'), btnStyle = childElement.style
        childElement.id ="Extract Data";
        childElement.setAttribute("style", "font-size:16px;color:#00b0e6; border-width: 0;border: 1px solid black;  right: 35px; position: absolute; background-color:white;cursor:pointer");
        childElement.innerText=text;
        document.body.appendChild(childElement);
        childElement.onclick = onclick;
        Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
    }
        }
    if(isCICProd){
    setTimeout(function(){
            addButton('Developer details', buttonClick);
       },2000);
        function buttonClick() {
            let devName = document.querySelector("#nameval").innerText;
            let devMail = document.querySelector("#emailval > a").innerText
            var temp = document.createElement("textarea");
                document.body.appendChild(temp);
                    temp.value = `Developer email ID: ${devMail}\nDeveloper Name: ${devName}`
                    temp.select();
                    document.execCommand('copy');
                    temp.remove();
            alert("Data extracted")
        }
        function addButton(text, onclick) {
        let cssObj = {position: 'absolute', top: '16%', right:'10.65%', 'z-index': 3};
        let childElement = document.createElement('button'), btnStyle = childElement.style
        childElement.id ="Extract Data";
        childElement.setAttribute("style", "font-size:16px;color:#00b0e6; border-width: 0;border: 1px solid black;  right: 35px; position: absolute; background-color:white;cursor:pointer");
        childElement.innerText=text;
        document.body.appendChild(childElement);
        childElement.onclick = onclick;
        Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
    }
    }



})();