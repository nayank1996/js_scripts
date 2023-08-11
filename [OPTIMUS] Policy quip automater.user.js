// ==UserScript==
// @name         [OPTIMUS] Policy quip automater
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Saving time Lots of time!!!!
// @author       nayankjh@
// @match        https://optimus-prod.aka.amazon.com/skill/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// ==/UserScript==
var $ = window.jQuery;
(function() {
    'use strict';
    setTimeout(function(){
        let url = window.location.href.split('/')
        let url1 = window.location.href
        let tester = document.querySelector("#app > section > header > div > div.ant-col.ant-col-2.optimus-text-right > span").innerText
        let badges = document.querySelector("#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div.m-t-sm > div:nth-child(2)").getElementsByTagName('div')
        let badName = []
        console.log(badges[0])
       for(var i=0;i<badges.length;i++){
       badName.push(badges[i].innerText)
       }
        let skillId = url[4]
        let version = url[6]
        let skillName = document.querySelector("#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(1) > div.ant-col.ant-col-16 > div:nth-child(1) > span").innerText
        let vendr = document.querySelector("#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(1) > div.ant-col.ant-col-16 > a:nth-child(2) > span").innerText
        var today = new Date();
        var date = (today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate());
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var top =$("#app > section > header > div > div.ant-col.ant-col-3 > div > span");
        var childElement = document.createElement('input');
    childElement.id ="tcoButton";
    childElement.setAttribute("style", "position: absolute; top: 1.5%; right:72%; z-index: 3;font-size:10px; border-radius: 8px; margin-left:5px ; padding:2px 3px; background-color:white");
    childElement.className="button danger test_activity_escalate";
    childElement.type="button";
    childElement.value="Go";
    var select = document.createElement('select');
    select.id="tcoSelect";
    var option;
    var inputdata = "TM Policy quip||MAU Skill Quip||ISP Escalation quip";

    inputdata.split( '||' ).forEach(function(item) {

        option = document.createElement('option');

        option.value = option.textContent = item;

        select.appendChild(option);
});
    select.setAttribute("style", "position: absolute; top: 2%; right:74%; z-index: 3;margin-left: 10px ; font-size: 14px ; color: black");
        document.body.appendChild(select);
        document.body.appendChild(childElement);

        $("#tcoButton").click(function() {

        var selectMain= document.getElementById("tcoSelect");
        var tco="";
        tco=selectMain.value;

        switch(tco)
        {
             case 'TM Policy quip':
                var temp = document.createElement("textarea");
                document.body.appendChild(temp);
        //temp.value = testerId + "\t" + date;
                    temp.value = `${skillName}\t${skillId}\t${version}\t\t${tester}\t${badName}` ;
                    temp.select();
                    document.execCommand('copy');
                    temp.remove();
     window.open("https://quip-amazon.com/mY9nAh8mBMnq/TM-Policy-LaunchTMReportamzn1askskill11196494-ca64-4c02-acab-baad95969fd91xlsm#temp:C:VOd98dbc15938794efad47290d96");
                break;
                case 'MAU Skill Quip':
                var temp1 = document.createElement("textarea");
                document.body.appendChild(temp1);
                    temp1.value = `${date}\t${time}\t${url1}\t${skillName}\t${tester}\t\tFunctional` ;
                    temp1.select();
                    document.execCommand('copy');
                    temp1.remove();
     window.open("https://quip-amazon.com/CfjTAf1Esa1l/MAU-skill-modification-request#VNC9CAVAaLu");
                  break;
                case 'ISP Escalation quip':
                var temp2 = document.createElement("textarea");
                document.body.appendChild(temp2);
        //temp.value = testerId + "\t" + date;
                    temp2.value = `${skillName}\t${vendr}\t${url1}\t\t\t\t\t${date}\t${tester}` ;
                    temp2.select();
                    document.execCommand('copy');
                    temp2.remove();
     window.open("https://quip-amazon.com/SiU2Ab9CP5P2/ISP-Skill-Escalations-1#temp:C:DGH73c6352076ac4905b3e3eb1cc");
                break;
            default: console.log('default');
        }


    });
    },7000)
})();