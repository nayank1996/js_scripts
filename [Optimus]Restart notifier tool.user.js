// ==UserScript==
// @name        [Optimus]Restart notifier tool
// @namespace   http://tampermonkey.net/
// @version     0.1
// @description copies the data required for quip automatically and notify slack
// @author      nayankjh@
// @match       https://optimus-prod.aka.amazon.com/activityList/skill/*
// @grant        GM_xmlhttpRequest

// ==/UserScript==

(function() {
    'use strict';
          setTimeout(function(){
            addButton('Functional Restart', buttonClick);
              addButton1('Security Restart', buttonClick);
              addButton2('SLU Restart', buttonClick);
              addButton3('CP Restart', buttonClick);
              addButton4('CX Restart', buttonClick);
              addButton5('Exception', buttonClick);
       },5000);
    function buttonClick() {
       let url = window.location.href.split('/');
        let url1 = window.location.href.split('=');
        let certID = url1[1];
        let uri = "https://alexa-skills-sams-jlb-iad.iad.proxy.amazon.com/api/certId/" + certID + "/activities?ipp=100"
        let activity = this.id;
        console.log(activity)
        let skillName = document.querySelector("#app > section > main > div > div.activityList.p-md.p-r-lg > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(1) > div.ant-col.ant-col-16 > div:nth-child(1) > span.skillInfo-header.optimus-text-huge.optimus-text-light").innerText;
        let tester = document.querySelector("#app > section > main > div > div.activityList.p-md.p-r-lg > div:nth-child(3) > div.currentUserActivities > div > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(5) > a").innerText;
        let testerId = tester.substr(0,tester.length-1);
        let skillId = url[5];
        let versionId = url[7].split('?');
        let version = versionId[0];
        let optimus = "https://optimus-prod.aka.amazon.com/skill/" + skillId + "/version/" + version + "/about?";
        var today = new Date();
        var date = (today.getMonth()+1+'/'+today.getDate()+'/'+today.getFullYear());
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var temp = document.createElement("textarea");
                document.body.appendChild(temp);
                    temp.value = `${optimus}\t ${date}\t ${time}\t ${skillName}\t \t${activity}\t ${testerId}` ;
                    temp.select();
                    document.execCommand('copy');
                    temp.remove();
  window.open("https://quip-amazon.com/B7X9Asw8bUn9/Restart-Details-2022#EcI9CAwtQ9O");
         GM_xmlhttpRequest({
                method: "GET",
                url: uri,
                onload: async function (response){
                    let val =JSON.parse(response.responseText);
                   let val1 = val.activityList;
                    let valArr = [];
                    let locales= [];
                    for(var i=0;i<val1.length;i++){
                    if(val1[i].mitigationStrategy == "MANUAL"){
                        if(!locales.includes(val1[i].locale)){ locales.push(val1[i].locale)}
                        if(val1[i].taskType === "Functional" && val1[i].locale.includes("en")){
                     valArr.push(val1[i].taskType+" "+val1[i].assignedUser.split('@')[0])
                           // +val1[i].locale+" "
                        }
                         if(val1[i].taskType === "CxPolicy" && val1[i].locale.includes("en")){
                     valArr.push(val1[i].taskType+" "+val1[i].assignedUser.split('@')[0])
                        }
                        if(val1[i].taskType === "Policy" && val1[i].locale.includes("en")){
                     valArr.push(val1[i].taskType+" "+val1[i].assignedUser.split('@')[0])
                        }
                    }
                    }
                    console.log(locales);
                    let func =[];
                    let pol =[];
                    let cxPol =[];
                    for(var j=0;j<valArr.length;j++){
                       if(valArr[j].includes("Functional")){
                       func.push(valArr[j])}
                        if(valArr[j].includes("CxPolicy")){
                        cxPol.push(valArr[j])}
                        if(valArr[j].includes("Policy") && !(valArr[j].includes("Cx"))){
                        pol.push(valArr[j])}
                        }
                    if(pol.length==0){
                    pol.push("CP AUTOBOT ")
                    }
                    if(cxPol.length==0){
                    cxPol.push("CX AUTOBOT ")
                    }
                    if(func.length==0){
                    func.push("FUNC. AUTOBOT ")
                    }
                    if(locales.length<= 7){
                        console.log(locales)
                        for(let g=0;g<locales.length;g++){
                        if(locales[g].includes("en")){
       let obj= {Data: optimus+'\nPlease restart.Quip updated.\nActivity to be restarted: '+activity + ' \nRequest by: '+testerId + '\nLocales Affected: ' + locales + '\nEN assigned as: ' +func[0] +' '+pol[0]+' '+cxPol[0]}
       let jsonObj = JSON.stringify(obj)
             GM_xmlhttpRequest({
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            url: 'https://hooks.slack.com/workflows/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',
                            dataType: 'json',
                            contentType: 'application/json',
                            overrideMimeType: 'application/json',
                            data: jsonObj,
                        })
                            break;
       } else{
       let obj= {Data: optimus+'\nPlease restart.Quip updated.\nActivity to be restarted: '+activity + ' \nRequest by: '+testerId + '\nLocales Affected: ' + locales}
       let jsonObj = JSON.stringify(obj)
          GM_xmlhttpRequest({
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            url: 'https://hooks.slack.com/workflows/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',
                            dataType: 'json',
                            contentType: 'application/json',
                            overrideMimeType: 'application/json',
                            data: jsonObj,
                        })
           break;
       }
         }
 }
                    else{
           let obj= {Data: optimus +'\nPlease restart.Quip updated.\nActivity to be restarted: '+activity + ' \nRequest by: '+testerId + '\nLocales Affected: ' + locales + '\nEN assigned as: ' +func[0] +' '+pol[0]}
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
                        }
        }
                })
    }
       function addButton(text, onclick) {
        let cssObj = {position: 'absolute', top: '55%', right:'1.65%', 'z-index': 3};
        let childElement = document.createElement('button'), btnStyle = childElement.style
        childElement.id ="Functional";
        childElement.setAttribute("style", "font-size:14px;color:#00b0e6; border-width: 0;border-right: 2px solid black;  right: 35px; position: absolute; background-color:white;cursor:pointer");
        childElement.innerText=text;
        document.body.appendChild(childElement);
        childElement.onclick = onclick;
        Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
    };
    function addButton1(text, onclick) {
        let cssObj = {position: 'absolute', top: '55%', right:'10.65%', 'z-index': 3};
        let childElement = document.createElement('button'), btnStyle = childElement.style
        childElement.id ="Security";
        childElement.setAttribute("style", "font-size:14px;color:#00b0e6; border-width: 0;border-right: 2px solid black;  right: 35px; position: absolute; background-color:white;cursor:pointer");
        childElement.innerText=text;
        document.body.appendChild(childElement);
        childElement.onclick = onclick;
        Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
    };
    function addButton2(text, onclick) {
        let cssObj = {position: 'absolute', top: '55%', right:'18.65%', 'z-index': 3};
        let childElement = document.createElement('button'), btnStyle = childElement.style
        childElement.id ="SLU";
        childElement.setAttribute("style", "font-size:14px;color:#00b0e6; border-width: 0; border-right: 2px solid black; right: 35px; position: absolute; background-color:white;cursor:pointer");
        childElement.innerText=text;
        document.body.appendChild(childElement);
        childElement.onclick = onclick;
        Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
    };
    function addButton3(text, onclick) {
        let cssObj = {position: 'absolute', top: '50%', right:'6.65%', 'z-index': 3};
        let childElement = document.createElement('button'), btnStyle = childElement.style
        childElement.id ="CP";
        childElement.setAttribute("style", "font-size:14px;color:#00b0e6; border-width: 0; border-right: 2px solid black; right: 35px; position: absolute; background-color:white;cursor:pointer");
        childElement.innerText=text;
        document.body.appendChild(childElement);
        childElement.onclick = onclick;
        Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
    };
    function addButton4(text, onclick) {
        let cssObj = {position: 'absolute', top: '50%', right:'12.65%', 'z-index': 3};
        let childElement = document.createElement('button'), btnStyle = childElement.style
        childElement.id ="CX";
        childElement.setAttribute("style", "font-size:14px;color:#00b0e6; border-width: 0; border-right: 2px solid black; right: 35px; position: absolute; background-color:white;cursor:pointer");
        childElement.innerText=text;
        document.body.appendChild(childElement);
        childElement.onclick = onclick;
        Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
    };
    function addButton5(text, onclick) {
        let cssObj = {position: 'absolute', top: '50%', right:'18.65%', 'z-index': 3};
        let childElement = document.createElement('button'), btnStyle = childElement.style
        childElement.id ="Exception";
        childElement.setAttribute("style", "font-size:14px;color:#00b0e6; border-width: 0;border-right: 2px solid black; right: 35px; position: absolute; background-color:white;cursor:pointer");
        childElement.innerText=text;
        document.body.appendChild(childElement);
        childElement.onclick = onclick;
        Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
    };
})();
