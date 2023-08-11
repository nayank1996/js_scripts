// ==UserScript==
// @name        Project Manthan Survey
// @namespace   http://tampermonkey.net/
// @version     0.1
// @description Survey to identify high engagement and monetization potential skills
// @author      aswathyu@,nayankjh@
// @match       https://optimus-prod.aka.amazon.com/activityList/skill/*

// ==/UserScript==

(function() {
    'use strict';
          setTimeout(function(){
            addButton('Project Manthan Survey', buttonClick);
       },5000);
    function buttonClick() {
       let url = window.location.href.split('/');
        //console.log(url);
        let skillName = document.querySelector("#app > section > main > div > div.activityList.p-md.p-r-lg > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(1) > div.ant-col.ant-col-16 > div:nth-child(1) > span.skillInfo-header.optimus-text-huge.optimus-text-light").innerText;
        let tester = document.querySelector("#app > section > main > div > div.activityList.p-md.p-r-lg > div:nth-child(3) > div.currentUserActivities > div > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(5) > a").innerText;
        let testerId = tester.substr(0,tester.length-1);
        let skillId = url[5];
        let versionId = url[7].split('?');
        let version = versionId[0];
        let optimus = "https://optimus-prod.aka.amazon.com/skill/" + skillId + "/version/" + version + "/about?";
        var today = new Date();
        var date = (today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate());
        var temp = document.createElement("textarea");
                document.body.appendChild(temp);
        //temp.value = testerId + "\t" + date;
                    temp.value = `${testerId}\t ${date}\t ${skillName}\t ${optimus}\t ${skillId}\t ${version}` ;
                    temp.select();
                    document.execCommand('copy');
                    temp.remove();
     window.open("https://quip-amazon.com/WBf6AudETbp2/Project-Manthan-Survey-2022-continue");
    }
    function addButton(text, onclick) {
        let cssObj = {position: 'absolute', top: '10%', right:'40.65%', 'z-index': 3};
        let childElement = document.createElement('button'), btnStyle = childElement.style
        childElement.id ="ttButton";
        childElement.setAttribute("style", "font-size:15px; border-radius: 10px;  right: 35px; position: absolute; background-color:yellow;cursor:pointer");
        childElement.innerText=text;
        document.body.appendChild(childElement);
        childElement.onclick = onclick;
        Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
    };
})();
