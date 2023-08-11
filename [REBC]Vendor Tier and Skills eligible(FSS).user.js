// ==UserScript==
// @name         [REBC]Vendor Tier/Skills eligible(FSS)
// @namespace    https://iqdashboard.alexa.amazon.dev/
// @version      0.1
// @description  Gets the vendorId from the Optimus and uses IQD v3 backend to pull vendor tier and checks for all REBC exclusions for testers
// @author       torsfeld@ nayankjh@
// @match        https://optimus-prod.aka.amazon.com/skill/*
// @require      https://code.jquery.com/jquery-1.11.1.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    var $ = window.jQuery;
    'use strict';
    var val=0;
    let pathname = window.location.pathname;
    let skillId = pathname.split('/')[2];
    let skillVersion = pathname.split('/')[4];
    let exclBadge = ['ISP','AMAZON_PAY', 'FINANCIAL_SKILL', 'NI','VerifiedHighRisk_Security','PaidSkill','ChildDirected','CHILD_DIRECTED','VerifiedHighRisk_Policy', 'DRS_RelationshipModel_HighRisk_Security', 'DRS_RelationshipModel_HighRisk_Policy','Person_ID','WIDGETS', 'ALEXA_SHOPPING', 'Blueprint', 'COMPOUND']
    fetch('https://alexaskillcontent-ca-iad.iad.proxy.amazon.com/api/cops-manifests/certification/'+skillId+'/'+skillVersion+'?withCopsDerivedData=true')
        .then(response => response.json())
        .then(function(data) {
        //console.log('gvt - skilldata api', data)
        //console.log('gvt - vendorId', data.skillManifest.vendorId)
        return data.skillManifest.vendorId
    })
    .then(vendorId => {
        //console.log('gvt - vendorId 2', vendorId)
        fetch('https://sprs6bhs7f.execute-api.eu-west-1.amazonaws.com/staging/vendortiers/?vendorId=' + vendorId)
        .then(response => response.json())
        .then(result => {
           console.log(result)
           if(result.data.length > 0){
                  if(result.data[0].dev_tier_level !='Tier_3'&&result.data[0].dev_tier_level !='Tier_2'){val++
                                                        setTimeout(function () {
                let mauSpan = $('#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(2) > div.ant-col.ant-col-16 > span:nth-child(6) > span');
                let mauData = $("<span>").css("background-color", "yellow")
                mauData.html(' Not A REBC skill Due to Vendor Tier');
             mauSpan.after(mauData)
            }, 8000)
              }
         setTimeout(function () {
                let mauSpan = $('#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(2) > div.ant-col.ant-col-16 > span:nth-child(6) > span');
                let mauData = $("<span>")
                mauData.html(' | Vendor name: ' + result.data[0].vendor_name + ' | Vendor id: ' + result.data[0].vendor_id + ' | Vendor tier: ' + result.data[0].dev_tier_level);
             mauSpan.after(mauData)
            }, 7000)
           } if(result.data.length == 0) {
       let arr = [];
       let data = {"searchString":vendorId,"from":0,"size":100,"sortKey":"submittedAt","sortOrder":"desc","filters":{}}
   let jsonObj = JSON.stringify(data)
   GM_xmlhttpRequest({
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            url: 'https://alexaskillcontent-ca-iad.iad.proxy.amazon.com/api/skills/search',
                            dataType: 'json',
                            contentType: 'application/json',
                            overrideMimeType: 'application/json',
                            data: jsonObj,
                            onload: async function (response){
                            let wholData = response.response
                            if(!wholData.match(/"LIVE"/gi)){
                            setTimeout(function () {
                let mauSpan = $('#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(2) > div.ant-col.ant-col-16 > span:nth-child(6) > span');
                let mauData = $("<span>").css("background-color", "yellow")
                mauData.html(' | Vendor tier: Tier_3 Manual');
             mauSpan.after(mauData)
            }, 7000)
                            }
                                else {val++
                                 setTimeout(function () {
                let mauSpan = $('#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(2) > div.ant-col.ant-col-16 > span:nth-child(6) > span');
                let mauData = $("<span>").css("background-color", "yellow")
                mauData.html(' Not A REBC skill Due to Vendor Tier');
             mauSpan.after(mauData)
            }, 8000)
                                     }
                            }
                        })
                  }
        })
    });
    fetch('https://alexaskillcontent-ca-iad.iad.proxy.amazon.com/api/cops-manifests/certification/'+skillId+'/'+skillVersion+'?withCopsDerivedData=true')
        .then(response => response.json())
        .then(function(data) {
        return data.enrichment.badges
    })
    .then(badges => {
console.log(badges)
       let arr = [];
       for(let i=0;i<exclBadge.length;i++){
       if(badges.includes(exclBadge[i])){
       arr.push(exclBadge[i])
       }}
       if(arr.length>0){
           val++
       setTimeout(function () {
      let mauSpan0 = $("#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(2) > div.ant-col.ant-col-16 > span:nth-child(6)");
      let newData0 = $("<span>").css("background-color", "rgb(255, 165, 0)")
      newData0.html('    ||Not A REBC Skill These Badges found  ' + arr)
         mauSpan0.after(newData0)
      },9000)}
    })
       fetch('https://alexaskillcontent-ca-iad.iad.proxy.amazon.com/api/cops-manifests/certification/'+skillId+'/'+skillVersion+'?withCopsDerivedData=true')
        .then(response => response.json())
        .then(function(data) {
        // console.log('gvt - vendorId', data.skillManifest.vendorId)
        return data.enrichment.locales
    })
    .then(locales => {

           let locales11 = ['ar-SA','nl-NL']
           let arr1 = []
           console.log(locales.length)
       for(let j=0;j<locales.length;j++){
           console.log(locales[j])
      if(locales11.includes(locales[j])){
         val++
      setTimeout(function () {
      let mauSpan4 = $("#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(2) > div.ant-col.ant-col-16 > span:nth-child(6)");
      let newData4 = $("<span>").css("background-color", "yellow")
      newData4.html('    ||Not A REBC Skill other locales present ')
         mauSpan4.after(newData4)
      },9000)
      break
}
       }
       })
    if(skillVersion>0){
    fetch('https://alexaskillcontent-ca-iad.iad.proxy.amazon.com/api/skill/skillId/'+skillId+'/status-history')
        .then(response => response.json())
        .then(function(data) {
        // console.log('gvt - vendorId', data.skillManifest.vendorId)
        return data
    })
    .then(data => {
        setTimeout(function () {
          //console.log(data)
       for(var a =0;a<data.length-1;a++){
        let stat = data[a].status
        console.log(stat)
       if(stat == "ARCHIVED" || stat == "LIVE" || stat == "SUPPRESSED"){
           val++
        let mauSpan1 = $("#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(2) > div.ant-col.ant-col-16 > span:nth-child(6)");
        let newData = $("<span>").css("background-color", "rgb(238, 130, 238)")
         newData.html('   |||Version Upgrade Skill')
         mauSpan1.after(newData)
           break;
        }
       }
        let vers = data.length-2
        },10000)
    })
    }
    setTimeout(function () {if(val==0){
    let mauSpad = $("#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(2) > div.ant-col.ant-col-16 > span:nth-child(6)");
      let newDada = $("<span>").css({"background-color": "yellow", "font-size": "16px"})
      newDada.html('    ||REBC Skill Please escalate to WFM ')
         mauSpad.after(newDada)
    } console.log(val)},13000)
})();