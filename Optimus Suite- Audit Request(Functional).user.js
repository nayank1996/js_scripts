// ==UserScript==
// @name         Optimus Suite- Audit Request(Functional)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Copies overall policy results
// @author       nayankjh
// @require      https://code.jquery.com/jquery-1.11.1.min.js
// @require      https://code.jquery.com/ui/1.11.1/jquery-ui.min.js
// @match        https://*.aka.amazon.com/activityDetail/*
// @match        https://optimus-preprod.aka.amazon.com/activityList/skill/*
// @match        https://optimus-prod.aka.amazon.com/activityList/skill/*
// @connect      alexacertquantum-gamma-iad.iad.proxy.amazon.com
// @connect      alexa-skills-sams-iad.iad.proxy.amazon.com
// @connect      alexa-skills-sams-gamma-iad.iad.proxy.amazon.com
// @connect      alexacertquantum.aka.amazon.com
// @connect      alexa-skills-mrcs-iad.iad.proxy.amazon.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @run-at document-end
// ==/UserScript==



(function() {
    'use strict';
     window.addEventListener('load', () => {
            addButton('Overall Functional', buttonClick);
        })
    var dataURL;
    var dataResponse;
    var locale;
    var excludedCountries;
    var maturityRating;
    var policyBlurb;
    var copied;
    var autobot;
    var count = 0;
    var contentPolicyCount = 0;
    var rowKey
	function buttonClick(){
       var parentN = document.querySelector("#app > section > main > div > div.activityList.p-md.p-r-lg > div:nth-child(3) > div.othersActivities > div > div > div > div > div > div > table > tbody");
        var allRow = parentN.getElementsByTagName('tr')
        for(var i=0;i<allRow.length;i++){
        if(allRow[i].getElementsByTagName('td')[2].innerText === 'English (CA)' && allRow[i].getElementsByTagName('td')[0].innerText === 'Functional'){
         rowKey= allRow[i].getAttribute('data-row-key')
              dataURL = "https://alexa-skills-sams-iad.iad.proxy.amazon.com/api/activityId/"+rowKey+"/activity";
		console.log(dataURL)
        callProcessDataURL(dataURL);
        } else {
        document.getElementById('ttButton').style.backgroundColor = "grey";
        policyBlurb = "OVERALL Functional RESULTS\n";
		var contentPolicyResults = getElementByXpath("//*[@rel='opener']/span[text()='Functional']/../../../td[3]/a");
        var node = contentPolicyResults.iterateNext()
		 rowKey = node.parentNode.parentNode.getAttribute('data-row-key');
            }
        }

	}
    function processContent() {
        var contentPolicyResults = getElementByXpath("//*[@rel='opener']/span[text()='Functional']/../../../td[3]/a");
        var node = null;
        autobot = false;
        count = 0;
        contentPolicyCount = getElementCountByXpath("//*[@rel='opener']/span[text()='Functional']/../../../td[3]/a");;
        while(node = contentPolicyResults.iterateNext()) {
            var region = node.text;
            var regionURL = node.href;
            locale = getLocale(region);
            var rowKey = node.parentNode.parentNode.getAttribute('data-row-key');
            let children = node.parentNode.parentNode.childNodes;
            var detailURL = node.href;
            var words = detailURL.split("/");
            var certMngrId = words[5];
            var activityId = words[9];
            var version = words[11];
            var testCategoryURL = "https://alexacertquantum.aka.amazon.com/api/risk-mitigation/results/query/skill/" + words[7] + "/version/" + version + "/OPTIMUS/completed/certification?certMngrId=" + certMngrId + "&locale=" + locale + "&activityId=" + rowKey + "&includeAuditedActivity=undefined";
           // console.log(testCategoryURL)
                GM_xmlhttpRequest({
               method: "GET",
               url: testCategoryURL,
               onload: processContentPolicy,
               synchronous: true
           });
            copied = "Copied";
        }
    }
    function addButton(text, onclick) {
        let cssObj = {position: 'absolute', top: '10%', right:'30.65%', 'z-index': 3};
        let childElement = document.createElement('button'), btnStyle = childElement.style
        childElement.id ="ttButton";
        childElement.setAttribute("style", "font-size:15px; border-radius: 10px;  right: 35px; position: absolute; background-color:yellow");
        childElement.innerText=text;
        document.body.appendChild(childElement);
        childElement.onclick = onclick;
        Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
    }
    function getElementCountByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
    }
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.ANY_TYPE, null);
    }
    function getLocale(region){
        if(region === "English (US)"){
            return "en_US";
        }
         if(region === "Spanish (ES)"){
            return "es_ES";
        }
        if(region === "English (GB)"){
            return "en_GB";
        }
        if(region === "English (CA)"){
            return "en_CA";
        }
        if(region === "English (AU)"){
            return "en_AU";
        }
        if(region === "English (IN)"){
            return "en_IN";
        }
        if(region === "Japanese (JP)"){
            return "ja_JP";
        }
        if(region === "Spanish (MX)"){
            return "es_MX";
        }
        if(region === "Spanish (US)"){
            return "es_US";
        }
        if(region === "Hindi (IN)"){
            return "hi_IN";
        }
        if(region === "German (DE)"){
            return "de_DE";
        }
        if(region === "French (FR)"){
            return "fr_FR";
        }
        if(region === "French (CA)"){
            return "fr_CA";
        }
        if(region === "Italian (IT)"){
            return "it_IT";
        }
        if(region === "Portuguese (BR)"){
            return "pt_BR";
        }
        if(region === "Arabic (SA)"){
            return "ar_SA";
        }
    }

     function processContentPolicy(rspObj) {
           let flag = 0
           count = count + 1;
         if(autobot !== true){
           var response =JSON.parse(rspObj.responseText);
              // console.log(response)
           var i;
           policyBlurb = policyBlurb + "Locale: " + response[0].locale + " Headless \n";
           let contentPolicy = "";
           let cpTestCases = "";
           for (i = 0; i < response.length; i++) {
               if(response[i].result === "No" && response[i].device === "ECHO"){
                   flag = 1
                   let subCategory= "";
                   let testCaseCount = 0;
                   let riskMetadataLength = dataResponse.taskMetadata.riskMetadata.length;
                   for(let j = 0; j < riskMetadataLength; j++){
                       let riskLength = dataResponse.taskMetadata.riskMetadata[j].risks.length;
                       for(let jj = 0; jj < riskLength; jj++){
                           if(dataResponse.taskMetadata.riskMetadata[j].risks[jj].riskId === response[i].riskId){
                               subCategory = dataResponse.taskMetadata.riskMetadata[j].category;
                           }
                       }
                       for(let kk = 0; kk < riskLength; kk++){
                           if(dataResponse.taskMetadata.riskMetadata[j].category === subCategory){
                               testCaseCount++;
                               if(dataResponse.taskMetadata.riskMetadata[j].risks[kk].riskId === response[i].riskId){
                                   kk = riskLength;
                               }
                           }
                       }
                   }
                   let testcaseNo = subCategory;
                   cpTestCases = cpTestCases + testcaseNo + ".  " + testCaseCount + ", ";
                   contentPolicy = contentPolicy + subCategory.substr(subCategory.indexOf(' ')) + ", ";
               }
           } //console.log(cpTestCases)

           if(flag == 1)
           {
               if (contentPolicy != ""){
                   policyBlurb = policyBlurb + "Functional Test Cases: " + cpTestCases + "\n";
               }
               else {
                   policyBlurb = policyBlurb + "Functional Test Cases: NA \n";
               }
           }

               policyBlurb = policyBlurb + "Locale: " + response[0].locale + " Display\n";
               contentPolicy = "";
           flag = 0
           cpTestCases = "";
             for (i = 0; i < response.length; i++) {
                 if(response[i].locale == "en_CA" || response[i].locale == "en_AU" || response[i].locale == "en_IN"){
               if(response[i].result === "No" && response[i].device === "ROOK"){
                   flag = 1
                   let subCategory= "";
                   let testCaseCount = 0;
                   let riskMetadataLength = dataResponse.taskMetadata.riskMetadata.length;
                   for(let j = 0; j < riskMetadataLength; j++){
                       let riskLength = dataResponse.taskMetadata.riskMetadata[j].risks.length;
                       for(let jj = 0; jj < riskLength; jj++){
                           if(dataResponse.taskMetadata.riskMetadata[j].risks[jj].riskId === response[i].riskId){
                               subCategory = dataResponse.taskMetadata.riskMetadata[j].category;
                           }
                       }
                       for(let kk = 0; kk < riskLength; kk++){
                           if(dataResponse.taskMetadata.riskMetadata[j].category === subCategory){
                               testCaseCount++;
                               if(dataResponse.taskMetadata.riskMetadata[j].risks[kk].riskId === response[i].riskId){
                                   kk = riskLength;
                               }
                           }
                       }
                   }
                   let testcaseNo = subCategory;
                   cpTestCases = cpTestCases + testcaseNo + ".  " + testCaseCount + ", ";
                   contentPolicy = contentPolicy + subCategory.substr(subCategory.indexOf(' ')) + ", ";
               } }else{
                      if(response[i].result === "No" && response[i].device === "KNIGHT"){
                   flag = 1
                   let subCategory= "";
                   let testCaseCount = 0;
                   let riskMetadataLength = dataResponse.taskMetadata.riskMetadata.length;
                   for(let j = 0; j < riskMetadataLength; j++){
                       let riskLength = dataResponse.taskMetadata.riskMetadata[j].risks.length;
                       for(let jj = 0; jj < riskLength; jj++){
                           if(dataResponse.taskMetadata.riskMetadata[j].risks[jj].riskId === response[i].riskId){
                               subCategory = dataResponse.taskMetadata.riskMetadata[j].category;
                           }
                       }
                       for(let kk = 0; kk < riskLength; kk++){
                           if(dataResponse.taskMetadata.riskMetadata[j].category === subCategory){
                               testCaseCount++;
                               if(dataResponse.taskMetadata.riskMetadata[j].risks[kk].riskId === response[i].riskId){
                                   kk = riskLength;
                               }
                           }
                       }
                   }
                   let testcaseNo = subCategory;
                   cpTestCases = cpTestCases + testcaseNo + ".  " + testCaseCount + ", ";
                   contentPolicy = contentPolicy + subCategory.substr(subCategory.indexOf(' ')) + ", ";
               }
               }

           } //console.log(cpTestCases)

           if(flag == 1)
           {
               if (contentPolicy != ""){
                   policyBlurb = policyBlurb + "Functional Test Cases: " + cpTestCases + "\n";
               }
               else {
                   policyBlurb = policyBlurb + "Functional Test Cases: NA \n";
               }
               }
           flag = 0
         }
         if(count == contentPolicyCount){
             GM_setClipboard(policyBlurb);
             alert(policyBlurb);
             document.getElementById('ttButton').style.backgroundColor = "yellow";
         }
    }
    function callProcessDataURL(dataURL){
        GM_xmlhttpRequest({
                    method: "GET",
                    url: dataURL,
                    onload: processDataURL,
                    synchronous: true
                });
    }

    function processDataURL(responseObj) {
        dataResponse = JSON.parse(responseObj.responseText);
        excludedCountries = "";
        maturityRating = "NA";
        if(typeof dataResponse.activityMetadata !== 'undefined' && typeof dataResponse.activityMetadata.marketPlaceRatings !== 'undefined'){
            maturityRating = dataResponse.activityMetadata.marketPlaceRatings[0].maturityRating;
        }
        if(typeof dataResponse.activityMetadata !== 'undefined' && typeof dataResponse.activityMetadata.excludedCountries !== 'undefined'){
            Object.keys(dataResponse.activityMetadata.excludedCountries).forEach(function(key) {
                excludedCountries = excludedCountries + key + ", ";
            });
        }
		processContent();
    }

})();