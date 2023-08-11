// ==UserScript==
// @name         [Policy]TM highlighter
// @namespace    https://iqdashboard.alexa.amazon.dev/
// @version      0.1
// @description  Alerts tester if TM tool to be used for a skill
// @author       nayankjh@
// @match        https://optimus-prod.aka.amazon.com/skill/*
// @match        https://optimus-preprod.aka.amazon.com/skill/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    var $ = window.jQuery;
    'use strict';
    var val=0;
   let parentText = $("<span>").css({"background-color" : "yellow","font-size" : "14px","margin-left" : "10px"})
    let pathname = window.location.pathname;
    let skillId = pathname.split('/')[2];
    let skillVersion = pathname.split('/')[4];
    let inclBadge = 'AudioPlayer'
    let exclBadge = ['SupportsAccountLinking', 'HTML','CUSTOM_INTERFACE', 'INSTANT_PUBLISH','Blueprint' ,'PrivateSkill', 'PRIVATE_SKILL', 'APP_LINKS', 'ASP', 'AMAZON_PAY', 'COLTRANE', 'Coltrane', 'A4H','AUTO_MIGRATION','CHILD_DIRECTED','APL','Display', 'ISP', 'VIDEOPLAYER','ALEXA_SHOPPING','PaidSkill','BULK_SUBMISSION']
    fetch('https://alexaskillcontent-ca-iad.iad.proxy.amazon.com/api/cops-manifests/certification/'+skillId+'/'+skillVersion+'?withCopsDerivedData=true')
        .then(response => response.json())
        .then(function(data) {
        if(data.skillManifest.skillTypes == 'CUSTOM'){
    return data.enrichment.badges
        } else {parentText.html('TM NOT eligible to use. Reason: Not an Audio skill')
               setTimeout(function(){
    let parent = $("#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(1) > div.ant-col.ant-col-16 > div:nth-child(1) > span")
    parent.after(parentText)
    },5000)}
    })

     .then(badges => {
        console.log(badges)
        let badgeFound =[]
    if(badges.includes(inclBadge)){
        for(let i=0;i<exclBadge.length;i++){
    if(badges.includes(exclBadge[i])){
        badgeFound.push(exclBadge[i])
    }} if(badgeFound.length > 0){
   parentText.html('TM Not Eligible.\nOut of scope badges found: '+badgeFound)
    }
    else{parentText.html('TM tool applicable Please add skill note "#TM_used for Policy".If in case TM throws error please update TM QUIP & launch skill MANUALLY."')
        }
    } else{
    parentText.html('TM NOT eligible to use.Reason: Skill is not an Audio skill')
    }
setTimeout(function(){
    let parent = $("#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(1) > div.ant-col.ant-col-16 > div:nth-child(1) > span")
    parent.after(parentText)
    },5000)
    })
    })();