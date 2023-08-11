// ==UserScript==
// @name         Optimus Suite- Audit Request
// @namespace    http://tampermonkey.net/
// @version      2.0
// @updateURL    https://drive.corp.amazon.com/view/Alexa%20Cetification%20Docs/Automation%20Script%20Library/%5BOptimus%5D%20OptimusSuite.user.js
// @description  Copies overall policy results
// @author       himdurga
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
            addButton('Overall Policy', buttonClick);
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
	function buttonClick(){
        document.getElementById('ttButton').style.backgroundColor = "grey";
        policyBlurb = "OVERALL POLICY RESULTS\n";
		var contentPolicyResults = getElementByXpath("//*[@rel='opener']/span[text()='Content Policy']/../../../td[3]/a");
		var node = contentPolicyResults.iterateNext()
		var rowKey = node.parentNode.parentNode.getAttribute('data-row-key');
		dataURL = "https://alexa-skills-sams-iad.iad.proxy.amazon.com/api/activityId/" + rowKey + "/activity";
		callProcessDataURL(dataURL);

	}
    function processContent() {
        var contentPolicyResults = getElementByXpath("//*[@rel='opener']/span[text()='Content Policy']/../../../td[3]/a");
        var node = null;
        autobot = false;
        count = 0;
        contentPolicyCount = getElementCountByXpath("//*[@rel='opener']/span[text()='Content Policy']/../../../td[3]/a");;
        while(node = contentPolicyResults.iterateNext()) {
            var region = node.text;
            var regionURL = node.href;
            locale = getLocale(region);
            var rowKey = node.parentNode.parentNode.getAttribute('data-row-key');
            let children = node.parentNode.parentNode.childNodes;

            //if(children[4].firstChild.text !== 'AUTOBOT'){
            var detailURL = node.href;
            var words = detailURL.split("/");
            var certMngrId = words[5];
            var activityId = words[9];
            var version = words[11];
            var testCategoryURL = "https://alexacertquantum.aka.amazon.com/api/risk-mitigation/results/query/skill/" + words[7] + "/version/" + version + "/OPTIMUS/completed/certification?certMngrId=" + certMngrId + "&locale=" + locale + "&activityId=" + rowKey + "&includeAuditedActivity=undefined";
            console.log(testCategoryURL)
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
        let cssObj = {position: 'absolute', top: '10%', right:'40.65%', 'z-index': 3};
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
           count = count + 1;
           if(autobot !== true){
           var response =JSON.parse(rspObj.responseText);
           var i;
           policyBlurb = policyBlurb + "Locale: " + response[0].locale + "\n";
           var contentPolicy = "";
           var cpTestCases = "";
           for (i = 0; i < response.length; i++) {
               if(response[i].result === "Yes" && response[i].device === "ECHO"){
                   var subCategory= "";
                   var testCaseCount = 0;
                   var riskMetadataLength = dataResponse.taskMetadata.riskMetadata.length;
                   for(var j = 0; j < riskMetadataLength; j++){
                       var riskLength = dataResponse.taskMetadata.riskMetadata[j].risks.length;
                       for(var jj = 0; jj < riskLength; jj++){
                           if(dataResponse.taskMetadata.riskMetadata[j].risks[jj].riskId === response[i].riskId){
                               subCategory = dataResponse.taskMetadata.riskMetadata[j].risks[jj].subCategory;
                           }
                       }
                       for(var kk = 0; kk < riskLength; kk++){
                           if(dataResponse.taskMetadata.riskMetadata[j].risks[kk].subCategory === subCategory){
                               testCaseCount++;
                               if(dataResponse.taskMetadata.riskMetadata[j].risks[kk].riskId === response[i].riskId){
                                   kk = riskLength;
                               }
                           }
                       }
                   }
                   var testcaseNo = subCategory.substr(0,subCategory.indexOf(' '));
                   cpTestCases = cpTestCases + testcaseNo + "." + testCaseCount + ", ";
                   contentPolicy = contentPolicy + subCategory.substr(subCategory.indexOf(' ')) + ", ";
               }
           }
           if (contentPolicy != ""){
               policyBlurb = policyBlurb + "Content Policy: " + contentPolicy.slice(0, -2) + "\n";
               policyBlurb = policyBlurb + "CP Test Cases: " + cpTestCases.slice(0, -2) + "\n";
           }
           else {
               policyBlurb = policyBlurb + "Content Policy: NA \n";
               policyBlurb = policyBlurb + "CP Test Cases: NA \n";
           }
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
        policyBlurb = policyBlurb + "Rating: " + maturityRating + "\n";
        if (excludedCountries != ""){
            policyBlurb = policyBlurb + "Country Exclusions: " + excludedCountries.slice(0, -2) + "\n";
        }
        else {
            policyBlurb = policyBlurb + "Country Exclusions: NA \n";
        }
		processContent();
    }

})();
