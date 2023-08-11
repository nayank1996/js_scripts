// ==UserScript==
// @name         Not tested Dot Tab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Click to make complete Echo tab as NT
// @author       nayankjh@
// @match        https://*.aka.amazon.com/activityDetail/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

      window.addEventListener('load', () => {
      notTestedButton1('Not Tested All ECHO Tab)', selectNotTestedButtonFn1)
      })
    function notTestedButton1(text, onclick) {
            let cssObj = {position: 'absolute', top: '106%', right:'70%', 'z-index': 3};
            let button = document.createElement('button'), btnStyle = button.style;
            document.body.appendChild(button);
            button.innerHTML = text;
            button.onclick = onclick;
            Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
        }
     function selectNotTestedButtonFn1() {
            selectButtonBySpan1("Not Tested");
        }
    function selectButtonBySpan1(spanVal) {
         let devices = document.getElementsByClassName("ant-radio-button-wrapper");
            const activityType = document.querySelectorAll('.p-lg')[2].textContent;
            let supported = false;
            let copyPolicyButton = false;
            //This switch statement makes adjustments for CX and Policy
            switch (activityType)
            {
                case "CX Tests":
                    if (spanVal === "Pass"||spanVal === "Not Tested") {
                        spanVal = "No";
                        supported = true;
                    }
                    else if (spanVal == "Copy Policy") {
                        copyPolicyButton = true;
                    }
                    break;
                case "Content Policy Tests":
                    supported = true;
                    if (spanVal == "Copy Policy") {
                        copyPolicyButton = true;
                    }
                    break;
                default:
                    supported = true;
                    if (spanVal == "Copy Policy") {
                        copyPolicyButton = true;
                    }

            }

                if(copyPolicyButton){
                //Chcek if user is inside the policy workflow
                var workflowTypeCheck = document.querySelector(".optimus-text-largest").textContent;

                if (workflowTypeCheck.includes("Content Policy Testing") || workflowTypeCheck.includes("Policy Feed")){
                    //Chcek if policy workflow is in progress
                    var inprogressCheck = document.querySelector('.ant-btn-primary span')
                    if(inprogressCheck){
                     alert ("Please complete the polciy workflow to copy blurb");
                    }
                    else{
                  // copyPolicyBlurb(devices);
                        alert("copied")
                    }
                }
                //User not in polciy workflow
                else {
                    alert("Oops! Looks like you are not in Content Policy Workflow. Please navigate to Content Policy workflow and click again.")

                }

            }
            //If the button is supported on this page, it will select the appropriate options. If not, an alert box will trigger.
            else if(supported)
            {
                //This for loop iterates through the devices tabs, such as ECHO, KNIGHT, BISHOP, and ROOK
                for (let k = 0 ; k < devices.length-1; k++)
                {
                    devices[k].click();
                    const categories = document.querySelectorAll(".riskCategories li");

                    //This for loop iterates through the test categories, such as Test Skill, Endpoint Test, etc.
                    for (let i = 0; i < categories.length; i++)
                    {
                        if (categories[i]) {
                            categories[i].click();
                            //This for loop iterates through the buttons and clicks on any matching spanVal based on the span tag
                            let buttonData = document.querySelectorAll(".ant-list-item-extra button");
                            for (let h = 0; h < buttonData.length; h++)
                            {
                                if (buttonData[h].getElementsByTagName("span")[0].innerHTML === spanVal || buttonData[h].getElementsByTagName("span")[0].innerHTML === "No")
                                {
                                    buttonData[h].click();
                                }
                            }
                        }
                    }
                }
            } else {
                //If there isn't a good way to support the button, an alert box informs the user.
                alert("The " + spanVal + " button is not supported for " + activityType);
            }
         }
})();