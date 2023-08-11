// ==UserScript==
// @name         ISP locales provider
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Provides all the locales name ISP product present
// @author       nayankjh@
// @match        https://optimus-prod.aka.amazon.com/skill/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==
var $ = window.jQuery;
(function() {
    'use strict';
   setTimeout(function(){
       var parent = $('.m-sm.ant-divider.ant-divider-horizontal')[0]
    let url = window.location.href.split('/');
       let skillId = url[4];
        let version = url[6];
        let url1 = "https://alexaskillcontent-ca-iad.iad.proxy.amazon.com/api/isps/skill/"+skillId+"/"+version+"?source=ACIS";
       console.log(url1)
       $.get(url1,function(data){
           var ISPdata = Object.keys(data[0].isp.ispInformation.definition.privacyAndCompliance)
           console.log(ISPdata)
         var child = "ISP Locales Present in ----->" + ISPdata
           parent.after(child);
       })
   },8000);
})();