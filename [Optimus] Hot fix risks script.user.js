// ==UserScript==
// @name         [Optimus] Hot fix risks script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       nayankjh@
// @match        https://optimus-prod.aka.amazon.com/activityDetail/certMngr/*/skill/*/activity/*/version/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    var $ = window.jQuery;
    'use strict';
var testCaseDict = ['FUNC_APL_customer_core_completed_information','FUNC_customer_core_completed_information','FUNC_APL_information_prompt_core_provide','FUNC_information_prompt_core_provide',
'FUNC_saying_complete_cancel_appropriate','FUNC_homecard_account_do_section','FUNC_invoking_AMAZONPauseIntent','FUNC_information_prompt_help','FUNC_core_functions_complete_able','FUNC_successful_skill_authentication_developer',
'FUNC_provided_account_set_skill_new','FUNC_provided_account_set_skill','FUNC_CCP_skill_permissions','FUNC_APL_slot_relevant_return_request','FUNC_slot_relevant_return_request','FUNC_APL_saying_complete_cancel_appropriate',
'FUNC_APL_slot_relevant_return_For_defined','FUNC_slot_relevant_return_For_defined','FUNC_requests_one_shot_apl_endpoint_return','FUNC_requests_one_shot_endpoint_return','FUNC_requests_one_shot_apl_endpoint','FUNC_requests_one_shot_endpoint',
'FUNC_Alexa_For_confirm_positive','FUNC_display_live_video_request','FUNC_invoking_audio_AMAZONResumeIntent','FUNC_control_intents_performing_functionality','FUNC_control_intents_stop','FUNC_control_intents_cancel','FUNC_APL_inputs_task_prompted_completing',
'FUNC_inputs_task_prompted_completing','FUNC_audio_core_functionality','FUNC_APL_errors_exactly_vocalized_responses','FUNC_errors_exactly_vocalized_responses','FUNC_whenever_remain_session_user',
'FUNC_APL_information_prompt_help','FUNC_saying_complete_stop_appropriate','FUNC_APL_saying_complete_stop_appropriate','FUNC_location_responses_appropriate','FUNC_APL_whenever_remain_session_user','39765792-30b3-4d04-b63e-6740350ec699','CP_function_skill_properly_review',]
let url = window.location.href.split('/');
let val = 0
let cert_id = url[5]
let skill_id = url[7]
let version = url[11]
let cops_manifest = `https://alexaskillcontent-ca-iad.iad.proxy.amazon.com/api/cops-manifests/certification/${skill_id}/${version}?withCopsDerivedData=true`
let cert_uri = `https://alexa-skills-sams-jlb-iad.iad.proxy.amazon.com/api/certId/${cert_id}/activities?ipp=100`
let locale, activity_id
let activity_uri = `https://alexacertquantum-jlb-iad.iad.proxy.amazon.com/api/risk-mitigation/results/query/skill/${skill_id}/version/${version}/OPTIMUS/completed/certification?certMngrId=${cert_id}&locale=${locale}&activityId=${activity_id}`
let arr = []
let apis = []
let global_tc
let count = false
setTimeout(function(){
            addButton('Check for Hot fix', buttonClick);
       },5000)
setTimeout(function(){var child = $("<span>").css({"margin-right": "0.5rem","font-size" : "14px","line-height": "1.5","padding": "0.1rem 0.8rem","border": "1px solid transparent","border-radius": "1.4rem","border-color": "rgb(0, 130, 150)"})},8000)
     function addButton(text, onclick) {
        let cssObj = {position: 'absolute', top: '65%', right:'35.65%', 'z-index': 3};
        let childElement = document.createElement('button'), btnStyle = childElement.style
        childElement.id ="ttButton";
        childElement.setAttribute("style", "margin-right:1rem; font-size:16px; line-height:2; padding: 0.3rem 1.0rem; border: 1.5px solid transparent;border-radius: 1.4rem;border-color: rgb(0, 130, 150");
        childElement.innerText=text;
        document.body.appendChild(childElement);
        childElement.onclick = onclick;
        Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
    };
    function buttonClick() {
    fetch(cops_manifest)
        .then(response => response.json())
        .then(function(data) {
        return data.enrichment.locales
    })
.then(locales => {

           let locales11 = ['en-US', 'en-GB','en-CA','en-AU','en-IN']
       for(let j=0;j<locales.length;j++){
      if(locales11.includes(locales[j])){
          continue}else {val++}
       }
    if(val<=0){certInformation(cert_uri)} else {alert('Out of Scope skill for Hot Fix pilot')}
       })
 function certInformation(cert_uri){
    fetch(cert_uri)
        .then(response => response.json())
        .then(function(data) {
        return data.activityList
    })
.then(activity => {
   //console.log(activity)
for(let i=0;i<activity.length;i++){
if((activity[i].mitigationStrategy == 'MANUAL') && (activity[i].taskType == 'Functional')){
locale = activity[i].locale
activity_id = activity[i].activityId
    console.log(locale, activity_id)
activity_uri = `https://alexacertquantum-jlb-iad.iad.proxy.amazon.com/api/risk-mitigation/results/query/skill/${skill_id}/version/${version}/OPTIMUS/completed/certification?certMngrId=${cert_id}&locale=${locale}&activityId=${activity_id}`
apis.push(activity_uri)
//actInformation(locale, activity_id)
} else {continue}
} console.log(apis)
for(let ii=0; ii<apis.length;ii++){
    GM_xmlhttpRequest ({
            method:         "GET",
            url:            apis[ii],
            responseType:   "json",
            onload:         activityFunc
        })
function activityFunc(response){
    console.log('I am running')
    if(count == false){
    let data = JSON.parse(response.responseText)
    for(let i=0;i<data.length;i++){
    if(data[i].result == 'No'){
        if(testCaseDict.includes(data[i].riskId)){
    continue
    } else {alert('Not eligible for Hot fix close as per DEIT process')
            count = true
        break }
    }}
  }
}}
    }) }
    }
})();