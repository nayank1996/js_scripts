// ==UserScript==
// @name         ITTILA Automater
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       nayankjh@
// @match        https://optimus-prod.aka.amazon.com/skill/*
// @match        http://10.91.38.59:8081/secure/Dashboard.jspa
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    var $ = window.jQuery;
    'use strict';
   if(location.href == "http://10.91.38.59:8081/secure/Dashboard.jspa"){
       mockClass();
    }else{
        optimusClass();
    }
    function optimusClass(){
    const btnLink = document.createTextNode("Audit this skill");
        const btnNode = document.createElement("BUTTON");
        btnNode.id = "Audit-link-button";
        btnNode.className = "button";
        btnNode.appendChild(btnLink);

        setTimeout(function(){
            const optimusHeaderIcon = $("div.ant-table-title > span")[0];
            optimusHeaderIcon.after(btnNode);
        },6000)
        btnNode.style.background = "#EEEEEE";
        btnNode.style.userSelect = "none";
        btnNode.style.border = "solid 5px #CCCCCC";
    btnNode.addEventListener("click", async function() {
           let urlOpt1 = window.location.href.split('/')
           let urlOpt = window.location.href
           let skillId = urlOpt1[4]
           let version = urlOpt1[6]
           let skillName = document.querySelector("#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(1) > div.ant-col.ant-col-16 > div:nth-child(1) > span").innerText
           GM_setValue("skill ID", skillId)
           GM_setValue("skill name",skillName);
           GM_setValue("Optimus Workflow Link",urlOpt);
           GM_setValue("Version Number", version);
        window.open('http://10.91.38.59:8081/secure/Dashboard.jspa')
        });
    }
function mockClass(){
    setTimeout(function(){
         var skillId = GM_getValue("skill ID")
        var skillName = GM_getValue("skill name");
        var urlOpt = GM_getValue("Optimus Workflow Link");
        var version = GM_getValue("Version Number");
        var issueBtn = document.querySelector("#create_link");
       issueBtn.click();
        // DE 10700 CQ 11300
         setTimeout(function(){
         var proj = document.querySelector("#project > optgroup:nth-child(1)").getElementsByTagName('option')[0].value
        if(proj == 11300 || proj == 10700){
         document.querySelector("#customfield_10204").value =skillId ;
            document.querySelector("#customfield_10202").value =skillName
            document.querySelector("#customfield_10412").value = urlOpt
            document.querySelector("#customfield_13755").value = version
        }else{
        document.querySelector("#customfield_10204").value =skillId ;
            document.querySelector("#customfield_10202").value =skillName
            document.querySelector("#customfield_10205").value = urlOpt
                document.querySelector("#customfield_13755").value = version
             document.querySelector("#customfield_10412").value = urlOpt
        }
         },2000);
        GM_setValue("skill ID", "")
           GM_setValue("skill name","");
           GM_setValue("Optimus Workflow Link","");
           GM_setValue("Version Number", "");
    },3000)
}
})();