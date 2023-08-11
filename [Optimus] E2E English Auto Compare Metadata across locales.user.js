// ==UserScript==
// @name         [Optimus] E2E English Auto Compare Metadata across locales
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       nayankjh@
// @match        https://optimus-prod.aka.amazon.com/skill/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
 var $ = window.jQuery;
    setTimeout(function(){
        //Get Skill ID and Version
        var CertId = document.querySelector('.ant-typography.skillIdInfo').innerText.trim();
        CertId = afterCut(CertId,"=");
        var Version = getLiveVersion();
        var CopsManifestURL = "https://alexaskillcontent-ca-iad.iad.proxy.amazon.com/api/cops-manifests/certification/" +CertId+"?version="+Version;
        console.log(CopsManifestURL);

        //Access to CopsManifest for Badge information
        GM_xmlhttpRequest ({
            method:         "GET",
            url:            CopsManifestURL,
            responseType:   "json",
            onload:         processJSON_Response,
        });
        function processJSON_Response (rspObj) {
            var skillType = rspObj.response.skillManifest.skillTypes
            var descriptionPageInfo =rspObj.response.skillManifest.skillManifestFeatures.publishingInformation.locales
            var mediaInfo =rspObj.response.enrichment.mediaInformation
            checkDuplicateItem(descriptionPageInfo, "description", "Long Description");
            checkDuplicateItem(descriptionPageInfo, "examplePhrases","Example Phrases");
            checkDuplicateImage(mediaInfo);
            checkDuplicateItem(descriptionPageInfo, "summary", "Short Description");
            checkDuplicateItem(descriptionPageInfo, "name", "Skill Title")
            checkDuplicateItem1(descriptionPageInfo,"updatesDescription", "What's New")
            if (skillType == "CUSTOM"){
                descriptionPageInfo = rspObj.response.skillManifest.skillManifestFeatures.apis.custom.locales
                checkDuplicateItem(descriptionPageInfo, "invocationName","Invocation Name")
            }
        }

        function checkDuplicateItem(descriptionPageInfo, typeOfItem, nameShow){

            var exportHtml = document.createElement("span");
            exportHtml.setAttribute('id','MetadataResults');
            var brElem = document.createElement("br")

            var allEnDescription = new Array();
            var hashDescription = {};

            for (var locale in descriptionPageInfo){
                if (locale.indexOf("en-") >= 0){
                    var metaDataFormatted = descriptionPageInfo[locale][typeOfItem].toString().replaceAll(" ","").replace(/\,|\./g,"").toUpperCase()
                    allEnDescription.push(metaDataFormatted);
                    //console.log(metaDataFormatted)
                }
            }
            var toString = Object.prototype.toString;

            //console.log(toString.call(descriptionPageInfo));

            //Eliminate Duplicate Description and create Array for duplicate Description and locale
            const uniqueDescription = Array.from(new Set(allEnDescription))
            var outPutResultArray = new Array();

            for (var index in uniqueDescription){
                var matchedlocale = new Array();
                var matchedDescription = uniqueDescription[index];

                for (locale in descriptionPageInfo){
                    metaDataFormatted = descriptionPageInfo[locale][typeOfItem].toString().replaceAll(" ","").replace(/\,|\./g,"").toUpperCase()
                    if (uniqueDescription[index] === metaDataFormatted && locale.indexOf("en-") >= 0){
                        matchedlocale.push(locale);
                    }
                }
                outPutResultArray.push({description: matchedDescription, locale: matchedlocale.join()});
            }
            //console.log(outPutResultArray)

            var outPutText ="";
            outPutResultArray.forEach(result => {
                outPutText = outPutText + result.locale + " have same " + nameShow + "\n"
            })
            exportHtml.textContent=outPutText
            $('.m-sm.ant-divider.ant-divider-horizontal')[0].after(exportHtml);
            var str = $('#MetadataResults').text();
            $('#MetadataResults').html(str.replace(/\r?\n/g, '<br>'));
        }
        function checkDuplicateItem1(descriptionPageInfo, typeOfItem, nameShow){

            var exportHtml = document.createElement("span");
            exportHtml.setAttribute('id','MetadataResults');
            var brElem = document.createElement("br")

            var allEnDescription = new Array();
            var hashDescription = {};

            for (var locale in descriptionPageInfo){
                if (locale.indexOf("en-") >= 0){
                   if(Object.keys(descriptionPageInfo[locale]).includes("updatesDescription")){
                    var metaDataFormatted = descriptionPageInfo[locale][typeOfItem].toString().replaceAll(" ","").replace(/\,|\./g,"").toUpperCase()
                    allEnDescription.push(metaDataFormatted);
                    //console.log(metaDataFormatted)
                } else {continue;}
                }
            }
            var toString = Object.prototype.toString;

            //console.log(toString.call(descriptionPageInfo));

            //Eliminate Duplicate Description and create Array for duplicate Description and locale
            const uniqueDescription = Array.from(new Set(allEnDescription))
            var outPutResultArray = new Array();

            for (var index in uniqueDescription){
                var matchedlocale = new Array();
                var matchedDescription = uniqueDescription[index];
                for (locale in descriptionPageInfo){
                     if(Object.keys(descriptionPageInfo[locale]).includes("updatesDescription")){
                    metaDataFormatted = descriptionPageInfo[locale][typeOfItem].toString().replaceAll(" ","").replace(/\,|\./g,"").toUpperCase()
                    if (uniqueDescription[index] === metaDataFormatted && locale.indexOf("en-") >= 0){
                        matchedlocale.push(locale);
                    }
                }
                }
                outPutResultArray.push({description: matchedDescription, locale: matchedlocale.join()});
            }
            //console.log(outPutResultArray)

            var outPutText ="";
            outPutResultArray.forEach(result => {
                outPutText = outPutText + result.locale + " have same " + nameShow + "\n"
            })
            exportHtml.textContent=outPutText
            $('.m-sm.ant-divider.ant-divider-horizontal')[0].after(exportHtml);
            var str = $('#MetadataResults').text();
            $('#MetadataResults').html(str.replace(/\r?\n/g, '<br>'));
        }

        function checkDuplicateImage(mediaInfo){

            var exportHtml = document.createElement("span");
            exportHtml.setAttribute('id','MetadataResults');
            var brElem = document.createElement("br")


            var allEnImage = new Array();
            var image = new Image();
            var metaDataFormatted;
            //console.log(mediaInfo);

            for (var locale in mediaInfo){
                if (mediaInfo[locale].locale.indexOf("en_") >= 0 && mediaInfo[locale].assetType == "icon"){
                    image.src = mediaInfo[locale].assetUrl
                    metaDataFormatted= image
                    allEnImage.push(metaDataFormatted);
                    //console.log(metaDataFormatted)
                }
            }

            //Eliminate Duplicate Description and create Array for duplicate Description and locale
            const uniqueIcon = Array.from(new Set(allEnImage))
            var outPutResultArray = new Array();

            for (var index in uniqueIcon){
                var matchedlocale = new Array();
                var matchedIcon = uniqueIcon[index];

                for (locale in mediaInfo){
                    image.src = mediaInfo[locale].assetUrl
                    metaDataFormatted = image

                    if (getBase64Image(uniqueIcon[index])
                        === getBase64Image(metaDataFormatted) && mediaInfo[locale].locale.indexOf("en_")
                        >= 0 && mediaInfo[locale].assetType
                        == "icon"){

                        matchedlocale.push(mediaInfo[locale].locale);
                    }
                }
                outPutResultArray.push({image: matchedIcon, locale: matchedlocale.join()});
            }

            //console.log(outPutResultArray)

            var outPutText ="";
            outPutResultArray.forEach(result => {
                outPutText = outPutText + result.locale + " have same Icon \n"
            })
            exportHtml.textContent=outPutText
            $('.m-sm.ant-divider.ant-divider-horizontal')[0].after(exportHtml);
            var str = $('#MetadataResults').text();
            $('#MetadataResults').html(str.replace(/\r?\n/g, '<br>'));
        }

    },12000)

    function getLiveVersion(){
        var versions = document.querySelectorAll('div.ant-select-selection-selected-value')[0].innerText;;
        versions = beforeCut(versions, " - ");
        return versions;
    }

    function beforeCut(str, cutStr) {

        var index = str.indexOf(cutStr);
        str = str.substring(0, index + 1);
        return str;
    }

    function afterCut(str, cutStr) {

        var index = str.indexOf(cutStr);
        str = str.substring(index+1);
        return str;
    }

    function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

})();