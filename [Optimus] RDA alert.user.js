// ==UserScript==
// @name         [Optimus] RDA alert
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       nayankjh@
// @match        https://optimus-prod.aka.amazon.com/activityList/skill/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        function addButton(text, onclick) {
        let cssObj = {position: 'absolute', top: '19%', right:'20.65%', 'z-index': 3};
        let childElement = document.createElement('span'), btnStyle = childElement.style
        childElement.id ="RDAButton";
        childElement.setAttribute("style", "color:#00b0e6;font-size:1.4rem;cursor:pointer; right: 35px; position: absolute; border:2px solid black; box-shadow: 5px 3px 2px black");
        childElement.innerText=text;
        document.body.appendChild(childElement);
        childElement.onclick = onclick;
        Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
    };
           addButton('Last Activity Closed', buttonClick);
       },3000);
    function buttonClick() {
        var btn = document.querySelector("#RDAButton");
        btn.innerText = "clicked";
        let urn =window.location.href;
        let url = window.location.href.split('=');
        //console.log(url);
        let certID = url[1];
        let tester = document.querySelector("#app > section > main > div > div.activityList.p-md.p-r-lg > div:nth-child(3) > div.currentUserActivities > div > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(5) > a").innerText;
        let testerId = tester.substr(0,tester.length-1);
        let uri = "https://alexa-skills-sams-jlb-iad.iad.proxy.amazon.com/api/certId/" + certID + "/activities?ipp=100"
        console.log(uri);
    const myInterval = setInterval(function(){
           GM_xmlhttpRequest({
                method: "GET",
                url: uri,
                onload: async function (response){
                    let val =JSON.parse(response.responseText);
                   let val1 = val.activityList;
                    console.log(val1.length)
                    let valArr = [];
                    for(var i=0;i<val1.length;i++){
                    if(val1[i].mitigationStrategy == "MANUAL"){
                     valArr.push(val1[i].taskType)
                    }
                    }
                    console.log(valArr);
                     if(valArr.includes("DevComm")){
                         var obj= {Data: urn +' Please Pick the RDA. '+ testerId}
       var jsonObj = JSON.stringify(obj)
        GM_xmlhttpRequest({
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            url: 'https://hooks.slack.com/workflows/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',
                            dataType: 'json',
                            contentType: 'application/json',
                            overrideMimeType: 'application/json',
                            data: jsonObj,
                        })
                         clearInterval(myInterval)
                     }
                }
                })
       },5000);
    }
})();