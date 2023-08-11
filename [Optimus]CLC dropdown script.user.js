// ==UserScript==
// @name         [Optimus]cross locale update
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  capture the reason for different results provided for certification!
// @author       nayankjh@
// @match        https://helpmateapps-tcp-iad.iad.proxy.amazon.com/testComparison/
// @match        https://issues.amazon.com/issues/*
// @updateURL    https://drive.corp.amazon.com/documents/Alexa%20Cetification%20Docs/Automation%20Script%20Library/cross%20locale.user.js
// @downloadURL  https://drive.corp.amazon.com/documents/Alexa%20Cetification%20Docs/Automation%20Script%20Library/cross%20locale.user.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

document.onload =(async function() {
    'use strict';
       if(window.location.href == "https://issues.amazon.com/issues/create?template=08d562aa-f663-45de-9ed1-af7d80f822fa"){
            window.alert("POC(FSS) :--- \nFor BLR (All EN Functional)-santgopa@ (rtejaswi@) \nFor JP locale-sayaomor@ (back-up mizunaka@) \nFor DE-anneeff@ (back-up ravramya@) \nFor FRITES OTP-cerases@(back-up andrtam@) \nFor SJO-fajose@ \nPOC(CP,CX) \nFor JP aikao@ (back-up sayaomor@) \nFor DE santgopa@ (back-up anneeff@) \nFor FRITES OTP uroxana@ (back-up balasaab@) \nFor SJO marjoz@ (back-up monthon@) \n For BLR hossaiam@ (back-up syezaki@)");
       };
   // Your code here...
    //Defining variables
    var jsonObj;
    var Url = parent.document.URL;
    var pathname = new URL(Url).pathname;
    var splitUrl = pathname.split('/');
    var skillId = splitUrl[5];
    var activityId = splitUrl[7];
    var skillVersion = splitUrl[9];
    var reasonOption, OtherLocale, currentLocale;
    //Defining option list and adding options to select option
    var title = document.createTextNode("Please choose a reason for inconsistency");
    var menu = document.createElement('select');
    var option1 = document.createElement('option');
    var option2 = document.createElement('option');
    var option3 = document.createElement('option');
    var option4 = document.createElement('option');
    var option5 = document.createElement('option');
    var option6 = document.createElement('option');
    GM_setValue("SkillID",skillId);
    //GM_setValue("Skillname",skill)
    option1.innerText = 'Please choose a reason for inconsistency';
    option2.innerText = '1. Nature of the skill - Different metadata/responses across locales.';
    option3.innerText = '2. Language specific SOP - Language/Locale specific SOPs.';
    option4.innerText = '3. Tester miss - Tester has incorrectly captured data for a test case/test cases.';
    option5.innerText = '4. SOP Gap - Unclear/Missing guidelines in the SOP.';
    option6.innerText = '5. Unable to verify (Language constraints) - Unable to verify the reason for inconsistency due to content being in a different language.';

    menu.appendChild(option1);
    menu.appendChild(option2);
    menu.appendChild(option3);
    menu.appendChild(option4);
    menu.appendChild(option5);
    menu.appendChild(option6);

    //Defining confirm button
    var button = document.createElement ('button');
    button.innerHTML = '<button id="confirmButton" type="button" color="white">'
        + 'Confirm!</button>';
    //Added check for data being popluated for helpmate pop up
    //Adding the select option and confirm button after helpmate is populated
    var interval = setInterval(displayOptions, 5000); // 2000 ms = start after 2sec
    //var testcases = document.querySelectorAll("#app_container > div > div > div > div.testComparison-body.flex-1 > div.testComparison > div > div > div.astro-table-wrapper > table > tbody > tr").length;
//console.log("testcase value at start",testcases);
    function displayOptions()
    {
        var testcases = document.querySelectorAll("#app_container > div > div > div > div.testComparison-body.flex-1 > div.testComparison > div > div > div.astro-table-wrapper > table > tbody > tr").length;
        //console.log("testcase value before for",testcases);
        for (var i=1;i<=testcases;i++){
            console.log("testcase value",i);
        var answersingle = document.querySelector("#app_container > div > div > div > div.testComparison-body.flex-1 > div.testComparison > div > div > div.astro-table-wrapper > table > tbody > tr:nth-child("+i+") > td:nth-child(3) > div > div").textContent;
        var singlelocale = answersingle.split(" ");
        answersingle = singlelocale[0];
        var answermulti = document.querySelector("#app_container > div > div > div > div.testComparison-body.flex-1 > div.testComparison > div > div > div.astro-table-wrapper > table > tbody > tr:nth-child("+i+") > td:nth-child(4) > div > div");
        if(answermulti!=null)
        {
            answermulti = answermulti.textContent;
            var multilocale = answermulti.split(" ");
            answermulti = multilocale[0];
        }
        else
        {
            answermulti = "-";
        }
        console.log("answer",answersingle,answermulti,"comparison",answersingle != answermulti && answermulti != "-");
        if (answersingle != answermulti && answermulti != "-")
        //if (document.querySelectorAll('.testComparison-body div')[18].textContent != "-")
        {
            if(document.querySelectorAll('.astro-text-huge')[0].textContent == "Compare Submission Results")
               {
            title.style = "top:10;right:10;position:absolute;float:left;height:40px;z-index:99999;padding:0px;width:100%;";
            menu.style = "right:0;position:relative;float:right;height:25px;z-index:99999;padding:0px;width:100%;margin-bottom:20px";
            button.style = "right:0;position:relative;float:left;width:8.5%;z-index:99999;padding:0px;color:white";
            menu.id = "select-options";
            //var node = document.createElement("LI");
            //node.appendChild(document.createElement("select"));
            //var buttontoadd = parent.document.getElementsByTagName('button')[1];

            var proceedButton = document.querySelector('.m-r-lg');
            proceedButton.parentNode.insertBefore(menu, proceedButton);
            //var confirmButton = document.querySelector('.m-r-lg');
            //confirmButton.parentNode.insertBefore(button, confirmButton);
            //document. getElementById('confirmButton'). style. backgroundColor = 'white';
            //document.body.appendChild(button);
            //document.getElementById("select-options").option[2].disabled;
            //document.body.appenChild(title);
            //document.getElementById('astro-checkbox-4-label').appenChild(button);
            //document.body.appendChild(menu);
            //document.getElementById("select-options").options[1].disabled;
            document.getElementById('select-options').appendChild(title);
            var div = document.getElementById ("select-options");
            var input = document.getElementById ("myInput");
            document.getElementById("select-options").options[0].disabled = true;
            document.getElementById("select-options").options[0].hidden = true;
            //document.getElementById('astro-checkbox-4-label').appenChild(button);
            //div.style.bottom = input.value + "px";
            //document.getElementsByClassName('astro__button')[1].appenChild(menu);
            clearInterval(interval);
        }
        }
    }
    }
    //check for data in "other_locales" column
    var checkExist = setInterval(function() {
        //console.log("testcase value before for",testcases);
        var testcases = document.querySelectorAll("#app_container > div > div > div > div.testComparison-body.flex-1 > div.testComparison > div > div > div.astro-table-wrapper > table > tbody > tr").length;
        for (var i=1;i<=testcases;i++){
        var answersingle = document.querySelector("#app_container > div > div > div > div.testComparison-body.flex-1 > div.testComparison > div > div > div.astro-table-wrapper > table > tbody > tr:nth-child("+i+") > td:nth-child(3) > div > div").textContent;
        var singlelocale = answersingle.split(" ");
        answersingle = singlelocale[0];
        var answermulti = document.querySelector("#app_container > div > div > div > div.testComparison-body.flex-1 > div.testComparison > div > div > div.astro-table-wrapper > table > tbody > tr:nth-child("+i+") > td:nth-child(4) > div > div");
        if(answermulti!=null)
        {
            answermulti = answermulti.textContent;
            var multilocale = answermulti.split(" ");
            answermulti = multilocale[0];
        }
        else
        {
            answermulti = "-";
        }
        console.log("answer",answersingle,answermulti,"comparison",answersingle != answermulti && answermulti != "-");
            if (answersingle != answermulti && answermulti != "-")
    //if (document.querySelectorAll('.testComparison-body div')[18].textContent != "-")
    {
        if(document.querySelectorAll('.astro-text-huge')[0].textContent == "Compare Submission Results")
               {

            var userId = window.parent.document.querySelectorAll('.ant-col')[2].textContent;
            var yesbutton = document.querySelectorAll('.astro-text-right button')[0].disabled;
            var yescheckbox = document.querySelectorAll('#astro-checkbox-4')[0].checked;

        //disable the yes option at first before user clicks on confirm button provided for option list
if (yescheckbox == false)
            {
               document.getElementById("select-options").disabled=true;
            }
            var event = document.getElementById("select-options");
        //Added event listener to select dropdown to and block yes option for 3rd option
            event.addEventListener("change", blockData);
            function blockData()
            {

                var reasonOption = event.selectedIndex;

                console.log('reason option', reasonOption)
                if(reasonOption === 3 )
                {
                    document.querySelectorAll('#astro-checkbox-4')[0].checked = false;
                    document.querySelectorAll('.astro-text-right button')[0].disabled = true;
                    window.open('https://issues.amazon.com/issues/create?template=08d562aa-f663-45de-9ed1-af7d80f822fa');
                }
                else if (reasonOption !== 3)
                         {
                             if ( document.querySelectorAll('#astro-checkbox-4')[0].checked == true)
                        {
                             document.querySelectorAll('.astro-text-right button')[0].disabled = false;
                             //document.querySelectorAll('#astro-checkbox-4')[0].checked = true;
                         }
                         }
            }
        //Added event listener for checkbox and blocking the checkbox untill user confirms
        var checkevent = document.querySelectorAll('#astro-checkbox-4')[0];
        checkevent.addEventListener("change", blockcheckData);
        function blockcheckData()
            {
                if (checkevent.checked)
            {
               document.getElementById("select-options").disabled=false;
            }
                var reasonOption = event.selectedIndex;
                console.log('reason option', reasonOption)
                if(reasonOption == 3)
                {
                    document.querySelectorAll('#astro-checkbox-4')[0].checked = false;
                    document.querySelectorAll('.astro-text-right button')[0].disabled = true;
                }
                else if (reasonOption != 3)
                         {
                             //document.querySelectorAll('#astro-checkbox-4')[0].checked = true;
                             document.querySelectorAll('.astro-text-right button')[0].disabled = true;
                         }
            }
        //Added event listener for confirm button and once button is clicked capturing the required data
            var e = document.getElementById("select-options");
            e.addEventListener("change", captureData);
            function captureData()
            {
        //Added check for option selected if 3rd option is not selected enable the checkbox and yes button
            var reasonOption = event.selectedIndex;
                if (reasonOption != 3)
                {

                   // document.querySelectorAll('.astro-text-right button')[0].click();
                    if ( document.querySelectorAll('#astro-checkbox-4')[0].checked == true)
                        {
                          document.getElementById("select-options").disabled=false;
                          document.querySelectorAll('.astro-text-right button')[0].disabled = false;
                          document.querySelectorAll('#astro-checkbox-4')[0].checked = true;
                        }

                }
                //Added check for option selected if 3rd option is selected disable the checkbox and yes button
                else if(reasonOption == 3)
                {
                    document.querySelectorAll('#astro-checkbox-4')[0].checked = false;
                    document.querySelectorAll('.astro-text-right button')[0].disabled = true;
                }
                //+++++Fetching OTHER LOCALE info+++++
                var temp = document.querySelectorAll('.testComparison-body div')[18].textContent.split(')');
                var temp3 = document.querySelectorAll('.testComparison-body div')[15].textContent.split(')');
                OtherLocale = [];
                currentLocale = [];
                var i,j;
                function localeFetch (temp,localesType) {
                    for(i=0;i<temp.length-1;i++)
                {
                    var temp2 = [];
                    var index = temp[i].indexOf('(');
                    while(index+1<temp[i].length){
                        temp2.push(temp[i][index+1]);
                        index++;

                    }
                    if(localesType==1){
                        OtherLocale.push(temp2.join(''));
                    }
                    else if(localesType==0){
                        currentLocale.push(temp2.join(''));
                    }
                }
                }
                localeFetch(temp,1);
                localeFetch(temp3,0);
                console.log(OtherLocale);
                console.log(currentLocale);
               //Adding timestamp
                var currentTime = new Date();
                var date = currentTime.getFullYear()+'-'+(currentTime.getMonth()+1)+'-'+currentTime.getDate();
                var time = currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();
                var dateTime = date+'T'+time;
                if (reasonOption !=0){

                // preparing the JSON obejct to send through post API
                var obj = { userId : userId, skillId : skillId , activityId : activityId , skillVersion : "v"+skillVersion.toString(), reasonOption : event.options[reasonOption].text, OtherLocale : OtherLocale.toString() , currentLocale : currentLocale.toString(), timeStamp : dateTime};
                jsonObj = JSON.stringify(obj);
                //Sending the JSON object using POST request through API gateway to lambda
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://pwkxiq8du9.execute-api.us-east-1.amazonaws.com/testApi/crosslocale",
                    dataType: 'json',
                    contentType: 'application/json',
                    overrideMimeType: 'application/json',
                    data: jsonObj,
                });
                console.log(jsonObj);
                }
                clearInterval(checkExist);}}}}}, 5000);
})();