// ==UserScript==
// @name         [Optimus]Dropdown for Various Hashtags in Notes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       nayankjh@
// @match        https://optimus-prod.aka.amazon.com/skill/*
// @match        https://optimus-preprod.aka.amazon.com/skill/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';
     setTimeout(function(){
      var parent =document.querySelector("#app > section > main > div > div > div > div.ant-row.m-l-lg.m-r-lg.skillDetailArea > div.ant-col.ant-col-6.skillNotesArea > div > div > div.ant-tabs-bar.ant-tabs-top-bar");
          var childElement = document.createElement('input');
         var noteSection = document.querySelector("#app > section > main > div > div > div > div.ant-row.m-l-lg.m-r-lg.skillDetailArea > div.ant-col.ant-col-6.skillNotesArea > div > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.skillNotes.m-l-lg.m-r-lg > div:nth-child(3) > textarea");
    childElement.id ="dropButton";
    childElement.setAttribute("style", "font-size:14px; cursor: pointer; border-radius: 4px; font-weight: 300; margin-left:0px ; padding:5px 15px; border: 1px solid #d9d9d9; background-color:#fff ; box-shadow: 0 2px 0 rgb(0 0 0 / 2%); color: black; margin-top: 10px");
    childElement.className="button danger test_activity_escalate";
    childElement.type="button";
    childElement.value="Add";
         parent.after(childElement);
         var select = document.createElement('select');
    select.id="DropSelect";
    var option;
    var inputdata = "---FUNCTIONAL---||#DEIT-Unmanaged||#DIEsame||#Geo-Restricted Audio Skill||#freeformcommunication||#SOPdeviation||#EdgeCaseScenario||Multi Modal SOP||Skill Differentiator SOP||Navigational SOP||Ambiguous Scenario||Inconsistent Behavior||----POLICY-----||#policy:||#policy-CP-CD TT:||#Policy–CP–Rating TT:||#Policy–CP–Re-submission TT:||#Policy–CP–Version Upgrade:||#Policy–[Other Policy TT]:||#Policy–CP–Healthcare TT/Escalation:||#Policy-IP Escalation TT:||#Policy-Personal assistant skill TT:||#Policy-Personal financial/Banking skill:||#Policy-Emergency Services Skill:||#Policy–ISP Skill:||#Policy–Transaction Skill:||#Policy-Audiobook Escalation TT:||#Policy-CX Escalation TT:||#Policy–CX Escalation Watchlist TT:";
     inputdata.split( '||' ).forEach(function(item) {

        option = document.createElement('option');
        option.setAttribute("style","opacity: 1;color: rgba(0,0,0,.65);font-size: 14px;font-variant: tabular-nums;");
        option.value = option.textContent = item;

        select.appendChild(option);
});
         select.setAttribute("style","padding: 0px 0px ; height: 30px;cursor: pointer;background-color: #fff;border: 1px solid #d9d9d9;border-top: 1.02px solid #d9d9d9;border-radius: 4px;color: rgba(0,0,0,.65);font-size: 14px;");
         parent.after(select);
         var selectMain= document.getElementById("DropSelect");
         childElement.onclick = function() {
          var hashTags= "";
             hashTags = selectMain.value;
         //hashTags.push(selectMain.value);
        noteSection.value = noteSection.textContent += hashTags + " ";
         };
},5000);
})();




