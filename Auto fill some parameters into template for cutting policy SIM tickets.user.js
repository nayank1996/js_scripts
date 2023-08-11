// ==UserScript==
// @name         Auto fill some parameters into template for cutting policy SIM tickets
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  This script automatically fills in some parameters(Skill ID, CIC URL, etc) into template which is already defined for policy tickets. This script shows pull down menu and button on Optimus. When policy team cut SIM tickets, this script can reduce time to fill in SIM templates field.
// @author       takug nayankjh sinrahun
// @match        https://optimus-preprod.aka.amazon.com/activityList/skill/*
// @match        https://optimus-beta.aka.amazon.com/activityList/skill/*
// @match        https://optimus-prod.aka.amazon.com/activityList/skill/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://skillcert.aka.amazon.com/application/skill/*

// @match        https://skillcert.aka.amazon.com/application/skill/*
// @match        https://*.aka.amazon.com/activityDetail/*
// @connect      alexacertquantum-gamma-iad.iad.proxy.amazon.com
// @connect      skillcert.aka.amazon.com
// @connect      optimus-prod.aka.amazon.com
// @connect      alexaskillcontent-iad.iad.proxy.amazon.com
// ==/UserScript==


var Locale_details='';


var OptimusURL = location.href;
var SkillIDPattern = new RegExp("amzn1\.ask\.skill\.[A-Za-z0-9-]+","g");
var SkillId = OptimusURL.match(SkillIDPattern)[0];
var VersionPattern = new RegExp("version/[0-9]+");
var Version =OptimusURL.match(VersionPattern)[0].replace("version/","");


//var CopsManifestURL = "http://alexaskillcontent-iad.iad.proxy.amazon.com/api/cops-manifests/certification/" +SkillId+"?version="+Version;
//var CopsManifestURL = "http://alexaskillcontent-iad.iad.proxy.amazon.com/api/cops-manifests/certification/amzn1.ask.skill.c5046d96-f93b-421a-af5b-d3e65f1188fb?version=4"

var CopsManifestURL = "http://alexaskillcontent-iad.iad.proxy.amazon.com/api/cops-manifests/certification/"+ SkillId;


var CICURL = "https://skillcert.aka.amazon.com/application/skill/"+ SkillId +"/4/detail.html";
var invocationName
var shortDescription
var Description
var SelectedLanguage
var skillType

(function() {
    'use strict';

    SelectedLanguage = '<Select id="SelectedLanguage">' +
    '<option value="pt_BR">Child Directed Skills Review (JP)</option><br>' +
    '<option value="ja_JP">Healthcare escalation</option>' +
    '<option value="es_MX">Rating escalation</option>' +
    '<option value="es_US">IP Escalations</option><br>' +
    '<option value="en_US">Audiobook Escalations</option><br>' +
    '<option value="en_UK">Policy type</option><br>' +
    '<option value="en_IN">Transaction</option><br>' +
    '<option value="en_AU">ISP</option><br>' +
    '<option value="en_CA">Personal assistant skills</option><br>' +
    '<option value="fr_CA">CX Escalations</option><br>' +
    '<option value="abc1">personal financial banking</option><br>' +
    '<option value="abc2">emergency service skill</option><br>'



    var appid = getAppId();

    languageDropDown(SelectedLanguage)
    //activityListButton('All Activities', selectAllActivityListButtonFn)
    //activityListButton('Open SIM', selectAllActivityListButtonFn)
    functionalActivityButton('Open SIM', selectfunctionalActivityButtonFn)

   // console.log('appid:' + appid);
   // console.log('SkillId:'+SkillId);
   // console.log('CopsManifestURL:'+CopsManifestURL);
    //console.log('CICURL'+CICURL);


    getfromCICmanifest()
    console.log('testestesteestes')
    function getfromCICmanifest(){
        GM_xmlhttpRequest({
            method: "GET",
            url: CopsManifestURL,
            responseType: "json",
            onload: processJSON_Response,
            //activityDevicesList = Array.from(JSON.parse(response.responseText).devicesList);
            //testCaseCategories = Array.from(JSON.parse(response.responseText).taskMetadata.riskMetadata);
        })


        function processJSON_Response(rspObj) {
           // console.log("SUCCESS")
            //console.log(rspObj.responseText)

            //Locale_details = $(rspObj).find('#locale-tab  selected').text().replace(/\s+/g, '');
            //console.log("locale-tab  selected:"+ Locale_details)
            //var Badges = rspObj.response.enrichment.badges
            //console.log('Badges:'+Badges)

            //var invocationName1 = rspObj.response.skillManifest.skillManifestFeatures.apis.custom.locales;
            //var invocationName = rspObj.response.skillManifest.skillManifestFeatures.apis.custom.loales.responseText;


            //invocationName = rspObj.skillManifest.asin
            skillType = rspObj.response.skillManifest.skillTypes

            invocationName = rspObj.response.skillManifest.skillManifestFeatures.apis.custom.locales["ja-JP"].invocationName;
           // console.log('invocationName:'+ invocationName)

            shortDescription = rspObj.response.skillManifest.skillManifestFeatures.publishingInformation.locales["ja-JP"].summary;
            //console.log('shortDescription:'+ shortDescription)


            Description = rspObj.response.skillManifest.skillManifestFeatures.publishingInformation.locales["ja-JP"].description;
           // console.log('Description:'+ Description)

/*
            var AccountLinkingFlag = rspObj.response.skillManifest.skillManifestFeatures.accountLinking.supportsLinking
            var Permission = rspObj.response.skillManifest.skillManifestFeatures.permissions
            console.log(AccountLinkingFlag)
            console.log(Permission)

            ActivityIndex.forEach(highlightActicity)
            Badges.forEach(highlightactivityBadges);
            highlightactivityALFlag(AccountLinkingFlag);
            Permission.forEach(highlightactivityPermissions)
            console.log(ShortMessage)
            console.log(message)
            */

        }

    }



    getfromCIC()

    function getfromCIC(){
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://skillcert.aka.amazon.com/application/skill/"+ SkillId +"/4/detail.html",
            responseType: "json",
            onload: processJSON_Response1,
        })
    }

    function processJSON_Response1(rspObj1) {
        console.log('!!!!!!!!!!!!!!!!!!!!')

            //console.log('rspObj1'+rspObj1.responseText)
            console.log(rspObj1)
            var text = rspObj1.responseText();
            console.log("Text:"+text)


            var parser = new DOMParser ();
            var doc = rspObj1.parseFromString (response.responseText, "text/html");
            console.log("doc: "+ doc)


            var myHTML = $.parseHTML(text);
            var venderName1 = $(myHTML).getElementById('#appVendorName').text();
            console.log(venderName1)


            var myHTML = $.parseHTML(rspObj1);
            console.log('my'+myHTML)
            alert(myHTML[0].tagName);


            var vendorName = rspObj1.getElementById("appVendorName").text;
            console.log('vendorName:'+vendorName)

            var venderName1 = $(rspObj1).find('#appVendorName').text().replace(/\s+/g, "");
            console.log('vendorName1:'+vendorName1)

            //var vendorName = $('#requestScopeUserId').text()
            //console.log('vendorName:'+vendorName)


            //var vendorName = rspObj1.querySelectorAll('#appVendorName')[0].textContent;
            //console.log('!!!vendorName!!!:' + vendorName)



        }



//==========================================================================================================

    function languageDropDown(text) {  //pulldown縺ｮvalue縺荊ext縺ｫ蜈･繧九▲縺ｽ縺�
        let cssObj = { position: 'absolute', top: '0.5%', right: '75%', 'z-index': 3 }
        let dropdown = document.createElement('select'),
        dropdownStyle = dropdown.style
        dropdown.innerHTML = text
        document.body.appendChild(dropdown)
        Object.keys(cssObj).forEach(key => dropdownStyle[key] = cssObj[key])
        //return button
    }








    function functionalActivityButton(text, onclick) {
        let cssObj = {position: 'absolute', top: '3.5%', right:'75%', 'z-index': 3}
        let button = document.createElement('button'), btnStyle = button.style
        document.body.appendChild(button)
        button.innerHTML = text




        button.onclick = onclick
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
        //return button
    }



    function selectfunctionalActivityButtonFn() {
        var rows = document.querySelectorAll('.ant-table-row');
        var allIds = '';
        var alias = getAlias();
         var optimus = "https://optimus-prod.aka.amazon.com/skill/" + SkillId + "/version/" + Version + "/about?"
         var devName = document.querySelector("#app > section > main > div > div.activityList.p-md.p-r-lg > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(1) > div.ant-col.ant-col-16 > a:nth-child(2) > span").innerText;
        for(var i=0; i<1; i++) {
            //var row = rows[i].getAttribute('data-row-key');
            //var ActivityType = rows[i].innerText
            var Idx= document.getElementsByTagName('select')[0].selectedIndex
            var tickets = document.getElementsByTagName('select')[0].options[Idx].text
            //console.log(row)
            //console.log(ActivityType.indexOf('CX'))



            switch(tickets){

                case 'Child Directed Skills Review (JP)':

                console.log("AAAAAAAAAAA")

                    var copyTextArea0 = document.createElement("TEXTAREA");
                    copyTextArea0.id = 'copySIDTextArea0'
                     console.log(optimus)
                      console.log(devName)
                    copyTextArea0.innerHTML =
'### [Please click the "Markdown" button below description field before clicking on "Create"]\n'+
'***\n'+
'#### Skill Details (Always Required)\n'+
'***\n'+
'Skill ID: ' +SkillId + '\n'+
                   'Developer Name:'+devName+' \n' +
                    'Optimus page link: '+optimus+'\n'+
'**If skill has been assigned as a Sev-3, please explain why:**\n'+

'**Was this skill identified by a keyword or Tester?**\n'+

'*If skill was flagged for a Keyword complete the following. Otherwise, put N/A.\n*'+

'**Flagged Keywords:**\n'+
'**Location of Keywords:**\n'+

'**Account Linking:**\n'+
'**CD Badge:**\n'+

'*If skill was flagged by a Tester please complete the following. Otherwise, put N/A.*\n'+

'**What test case caused you to flag this skill for escalation?**\n'+
'Insert test case 11.1, 11.2, 11.3, 11.4 or 11.5\n'+
'***\n'+
'***\n'+
'#### CX Details (Always Required)\n'+
'***\n'+
'**Invocation Name:**' +invocationName+'\n'+
'**Short Description:**'+ shortDescription +'\n'+
'**Long Description:**' +Description+'\n'+
'**Responses:**\n'+
'***\n'+
'***\n'+
'#### Information for Skill Resolvers (Always Required)\n'+
'***\n'+
'**Concern and Recommendation**\n'+
'[Tester adds their concern and recommendation here]\n'+
'***\n'+
'**Additional CP / CX Test Cases to be marked:**\n'+

'**Date / Time of Latency miss including time zone:**\n'+
'[Tester to either copy over information from IQ Dashboard or use data from workflow History page.\n' +
'E.g.  01/10/2022 12:15 pm +01:00]\n'+
'***\n'+
'### Please do not include any further information. This ticket is privileged and confidential and may not be discussed or shared with others.\n'
                    document.body.appendChild(copyTextArea0)
                    var log = document.getElementById('copySIDTextArea0').select();
                    document.execCommand("copy");
                    copyTextArea0.parentElement.removeChild(copyTextArea0);
                    window.alert("Template with Skill ID, CIC URL, and other information, has been inserted into your clipboard.\n\nPlease paste(Ctrl+v) it into SIM description field instead of default template.");
                    window.open("https://t.corp.amazon.com/create/templates/c6101e02-3901-484d-92fc-edca4465c511");
                break;
                case 'Healthcare escalation':
                    var copyTextArea0 = document.createElement("TEXTAREA");
                    copyTextArea0.id = 'copySIDTextArea0'


      copyTextArea0.innerHTML =
' ### [Please click the "Markdown" button below description field before clicking on "Create"]\n'+
'***\n'+
'#### Skill Details (Always Required)\n'+
'***\n'+
'Skill ID: ' +SkillId + '\n'+
'Developer Name:'+devName+' \n' +
'Optimus page link: '+optimus+'\n'+
'**If skill has been assigned as a Sev-3, please explain why:**\n'+
'***\n'+
'**Tier:** Managed/Unmanaged\n'+
'**If managed, who is BD/SA?** \n'+
'**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N\n'+
'***\n'+
'**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?** '+skillType+'\n '+
'**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).\n'+
'**Relevant Test Question:**\n'+
'**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card\n'+
'**Is the content that triggered this escalation in Alexas voice?** Y/N\n'+
'***\n'+
'***\n'+
'#### CX Details (Always Required)\n'+
'***\n'+
'**Invocation Name:**' +invocationName+'\n'+
'**Short Description:**'+ shortDescription +'\n'+
'**Long Description:**' +Description+'\n'+
'**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**\n'+
'***\n'+
'***\n'+
'#### Information for Skill Resolvers (Always Required)\n'+
'***\n'+
'**Concern and Recommendation**\n'+
'[Tester adds their concern and recommendation here]\n'+
'***\n'+
'**Additional CP / CX Test Cases to be marked:**\n'+

'**Date / Time of Latency miss including time zone:**\n'+
'[Tester to either copy over information from IQ Dashboard or use data from workflow History page.\n'+
'E.g.  01/10/2022 12:15 pm +01:00]\n'
                    document.body.appendChild(copyTextArea0)
                    var log = document.getElementById('copySIDTextArea0').select();
                    document.execCommand("copy");
                    copyTextArea0.parentElement.removeChild(copyTextArea0);

                   //console.log('Here3')

                    window.alert("Template with Skill ID, CIC URL, and other information, has been inserted into your clipboard.\n\nPlease paste(Ctrl+v) it into SIM description field instead of default template.");

                    window.open("https://t.corp.amazon.com/create/templates/1e89be99-b173-4138-9b18-89a96de7e55e");
                break;
                case 'Rating escalation':
                //console.log('CCCCCCCCCCCCC')

                    var copyTextArea0 = document.createElement("TEXTAREA");
                    copyTextArea0.id = 'copySIDTextArea0'
                    console.log(optimus)
                     console.log(devName)
                    copyTextArea0.innerHTML =


                   '### [Please click the "Markdown" button below description field before clicking on "Create"]\n'+
'***\n'+
'#### Skill Details (Always Required)\n'+
'***\n'+
'Skill ID: ' +SkillId + '\n'+
                   'Developer Name:'+devName+' \n' +
                    'Optimus page link: '+optimus+'\n'+
'**If skill has been assigned as a Sev-3, please explain why:**\n'+
'***\n'+
'**Tier:** Managed/Unmanaged\n'+
'**If managed, who is BD/SA?** \n'+
'**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N\n'+
'***\n'+
'**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?**'+skillType+'\n '+
'**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).\n'+
'**Relevant Test Question:**\n'+
'**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card\n'+
'**Is the content that triggered this escalation in Alexa voice?** Y/N\n'+
'***\n'+
'***\n'+

'#### Rating specific Questions (Always Required)\n'+
'***\n'+
'**Has this skill previously been reviewed for rating escalation?** If YES, please include the link to TT:\n'+

'**Content that raised your concern:**\n'+

'**Question for which skill will be rated Mature/ GS:**\n'+
'***\n'+
'***\n'+
'#### Information for Skill Resolvers (Always Required)\n'+
'***\n'+
'**Concern and Recommendation**\n'+
'[Tester adds their concern and recommendation here]\n'+
'***\n'+
'**Additional CP / CX Test Cases to be marked:**\n'+

'**Date / Time of Latency miss including time zone:**\n'+
'[Tester to either copy over information from IQ Dashboard or use data from workflow History page.\n'+
'E.g.  01/10/2022 12:15 pm +01:00]\n'


                    //console.log('Here1')


                    document.body.appendChild(copyTextArea0)
                    //console.log('Here2')


                    var log = document.getElementById('copySIDTextArea0').select();
                    document.execCommand("copy");
                    copyTextArea0.parentElement.removeChild(copyTextArea0);
                    //console.log('Here3')

                    window.alert("Template with Skill ID, CIC URL, and other information, has been inserted into your clipboard.\n\nPlease paste(Ctrl+v) it into SIM description field instead of default template.");

                    window.open("https://t.corp.amazon.com/create/templates/25accfe7-4e87-4a60-b050-57e3ef5a36fc");

                break;



                case 'IP Escalations':
                    var copyTextArea0 = document.createElement("TEXTAREA");
                    copyTextArea0.id = 'copySIDTextArea0'


                    copyTextArea0.innerHTML =
                    ' ### [Please click the "Markdown" button below description field before clicking on "Create"]\n'+
'***\n'+
'#### Skill Details (Always Required)\n'+
'***\n'+
'Skill ID: ' +SkillId + '\n'+
'Developer Name:'+devName+' \n' +
'Optimus page link: '+optimus+'\n'+
'**If skill has been assigned as a Sev-3, please explain why:**\n'+
'***\n'+
'**Tier:** Managed/Unmanaged\n'+
'**If managed, who is BD/SA?** \n'+
'**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N \n'+
'***\n'+
'**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?**'+skillType+'\n '+
'**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).\n '+
'**Relevant Test Question:**\n'+
'**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card\n'+
'**Is the content that triggered this escalation in Alexas voice?** Y/N\n'+
'***\n'+
'***\n'+
'#### CX Details (Always Required)\n'+
'***\n'+
'**Invocation Name:**' +invocationName+'\n'+
'**Short Description:**'+ shortDescription +'\n'+
'**Long Description:**' +Description+'\n'+
'**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**\n'+
'***\n'+
'***\n'+
'#### Information for Skill Resolvers (Always Required)\n'+
'***\n'+
'**Concern and Recommendation**\n'+
'[Tester adds their concern and recommendation here]\n'+
'***\n'+
'**Additional CP / CX Test Cases to be marked:**\n'+

'**Date / Time of Latency miss including time zone:**\n'+
'[Tester to either copy over information from IQ Dashboard or use data from workflow History page.\n'+
'E.g.  01/10/2022 12:15 pm +01:00]\n'



                    document.body.appendChild(copyTextArea0)



                    var log = document.getElementById('copySIDTextArea0').select();
                    document.execCommand("copy");
                    copyTextArea0.parentElement.removeChild(copyTextArea0);


                    window.alert("Template with Skill ID, CIC URL, and other information, has been inserted into your clipboard.\n\nPlease paste(Ctrl+v) it into SIM description field instead of default template.");

                    window.open("https://t.corp.amazon.com/create/templates/4d195005-6265-4607-8cd0-bedf386e8387");

                break;



                case 'Audiobook Escalations':

                    var copyTextArea0 = document.createElement("TEXTAREA");
                    copyTextArea0.id = 'copySIDTextArea0'


                    copyTextArea0.innerHTML =
'### [Please click the "Markdown" button below description field before clicking on "Create"]\n'+
'***\n'+
'#### Skill Details (Always Required)\n'+
'***\n'+
'Skill ID: ' +SkillId + '\n'+
'Developer Name:'+devName+' \n' +
'Optimus page link: '+optimus+'\n'+
'**If skill has been assigned as a Sev-3, please explain why:**\n'+
'***\n'+
'**Tier:** Managed/Unmanaged\n'+
'**If managed, who is BD/SA?**\n'+
'**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N\n'+
'***\n'+
'**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?**'+skillType+'\n '+
'**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).\n'+
'**Relevant Test Question:**\n'+
'**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card\n'+
'**Is the content that triggered this escalation in Alexas voice?** Y/N\n'+
'***\n'+
'***\n'+
'#### CX Details (Always Required)\n'+
'***\n'+
'**Invocation Name:**' +invocationName+'\n'+
'**Short Description:**'+ shortDescription +'\n'+
'**Long Description:**' +Description+'\n'+
'**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**\n'+
'***\n'+
'***\n'+

'#### Audiobook specific Details\n'+
'***\n'+
'a.1. **Is the skill entirely in TTS (Alexa or Polly voice)**?\n'+
'Ans: [Yes/No]\n'+

'a.2. **If above "a.1." is marked “yes”, is the content religious in nature (e.g., Bible, Bhagavad Gita, Talmud, Hadith, Quran, Vedas, Sutras, Torah)?**\n'+
'Ans: [Yes/No]\n'+
'***\n'+
'b. **Is the skill entirely in recorded audio?**\n'+
'Ans: [Yes/No]\n'+
'***\n'+
'c.1. **Does the skill use BOTH recorded audio and TTS (e.g., skill uses TTS to recite one story and then recorded audio to recite another)?**\n'+
'Ans: [Yes/No]\n'+

'c.2. **If above "c.1." is marked "yes" – please share details about when TTS is used and when recorded audio is used.**\n'+
'Ans: \n'+
'***\n'+
'd. **Does the skill include ISP (e.g., to purchase more stories, more character names)?**\n'+
'Ans: [Yes/No]\n'+
'***\n'+
'***\n'+
'#### Information for Skill Resolvers (Always Required)\n'+
'***\n'+
'**Concern and Recommendation**\n'+
'[Tester adds their concern and recommendation here]\n'+
'***\n'+
'**Additional CP / CX Test Cases to be marked:**\n'+

'**Date / Time of Latency miss including time zone:**\n'+
'[Tester to either copy over information from IQ Dashboard or use data from workflow History page.\n'+
'E.g.  01/10/2022 12:15 pm +01:00]\n'


                    document.body.appendChild(copyTextArea0)
                    console.log('Here2')


                    var log = document.getElementById('copySIDTextArea0').select();
                    document.execCommand("copy");
                    copyTextArea0.parentElement.removeChild(copyTextArea0);
                    console.log('Here3')

                    window.alert("Template with Skill ID, CIC URL, and other information, has been inserted into your clipboard.\n\nPlease paste(Ctrl+v) it into SIM description field instead of default template.");

                    window.open("https://t.corp.amazon.com/create/templates/364c04c5-095c-45e9-8836-fdbd5b24fc32");

                break;



                case 'Policy type':

                    var copyTextArea0 = document.createElement("TEXTAREA");
                    copyTextArea0.id = 'copySIDTextArea0'


                    copyTextArea0.innerHTML =
                    '**Please add the App ID in the Tag section (ex.: 22828292)**\n' +
                    ' \n' +
                    '**Skill Details (Always Required)**\n' +
                    'Skill ID: ' +SkillId+ '\n' +
                    'Developer Name:'+devName+' \n' +
                     'Optimus page link: ' +optimus+'\n'+
                    'If skill has been assigned as a Sev-3, please explain why:\n' +
                    ' \n' +
                    ' \n' +
                    '**Tier:** Managed/Unmanaged\n' +
                    'If managed, who is BD/SA?\n' +
                    'If managed, has the BD or SA communicated any PR/marketing related info: Y, N?\n' +
                    '\n' +
                    'Is the skill Custom, Content, or Blueprint? Choose one out of the 3 options: \n' +
                    'Are policy concerns NOT being presented through TTS responses? If so, upload recorded audio (only for EN, DE, JP).\n' +
                    'Relevant test question:\n' +
                    'Where did the concern was found? Choose the relevant: Metadata/Response/Home card\n' +
                    'Is the content that triggered this escalation in Alexa\'s voice? Y/N\n' +
                    ' \n' +
                    '**CX Details (Always Required)**\n' +
                    'Invocation Name: ' +invocationName+ '\n' +
                    'Long Description: ' + Description+ '\n' +
                    'Content Violation Sample Response in Dialog/Home Card Content/Metadata: \n' +
                    ' \n' +
                    '**Concern and Recommendation (Always Required)**\n' +
                    '[Tester adds their concern and recommendation here]'


                    console.log('Here1')

                    document.body.appendChild(copyTextArea0)
                    console.log('Here2')


                    var log = document.getElementById('copySIDTextArea0').select();
                    document.execCommand("copy");
                    copyTextArea0.parentElement.removeChild(copyTextArea0);
                    console.log('Here3')

                    window.alert("This type is deprecated");

                   // window.open("https://t.corp.amazon.com/create/templates/af88c506-343c-433f-be7e-299eaa83daf3");

                break;



                case 'Transaction':

                    var copyTextArea0 = document.createElement("TEXTAREA");
                    copyTextArea0.id = 'copySIDTextArea0'


                    copyTextArea0.innerHTML =
                   '### [Please click the "Markdown" button below description field before clicking on "Create"]\n'+
'***\n'+
'#### Skill Details (Always Required)\n'+
'***\n'+
'Skill ID: ' +SkillId+ '\n' +
                    'Developer Name:'+devName+' \n' +
                     'Optimus page link: ' +optimus+'\n'+
'**If skill has been assigned as a Sev-3, please explain why:**\n'+
'***\n'+
'**Tier:** Managed/Unmanaged\n'+
'**If managed, who is BD/SA?**\n'+
'**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N\n'+
'***\n'+
'**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?**'+skillType+'\n '+
'**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).\n'+
'**Relevant Test Question:**\n'+
'**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card\n'+
'**Is the content that triggered this escalation in Alexas voice?** Y/N\n'+
'***\n'+
'***\n'+
'#### CX Details (Always Required)\n'+
'***\n'+
'**Invocation Name:**' +invocationName+'\n'+
'**Short Description:**'+ shortDescription +'\n'+
'**Long Description:**' +Description+'\n'+
'**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**\n'+
'***\n'+
'***\n'+
'#### Transaction skills specific\n'+
'***\n'+
'*Please check* https://wiki.labcollab.net/confluence/pages/viewpage.action?spaceKey=COPS&title=Transaction+Skill+SOP+and+Decision+Tree \n'+
'*for the most up-to-date Transaction Skills SOP.*\n'+
'***\n'+
'**Company Summary:**\n'+
'***\n'+
'**Does the skill or company’s business model violate any content policies?**\n'+

'e.g. controlled substances like alcohol, tobacco, marijuana;  sexual content; hateful or culturally insensitive products\n'+

'**Does the skill’s invocation name match the company or brand name?** Y/N\n'+
'***\n'+
'**Summary of skill functionality:**\n'+
'***\n'+
'**If managed skill, did skill participate in beta test?** Y/N\n'+

'**Example interaction from launch through order completion:**\n'+

'**Does skill support the cancel intent?**\n'+
'*not required for cart-building or wishlist skills*\n'+

'**Does the cancel intent just specify information on how the customer can cancel their order?**\n'+

'e.g., “to cancel, please call this phone number or email ___\n'+

'**Can the customer cancel their transaction within the skill?** \n'+

'**Does the skill confirm that the transaction is complete by (1) voice, (2) home card/SMS, and (3) email (unless its  a cart building skill and email is not required)?** \n'+
'*Provide screen shot of home card and email if available*\n'+

'**If skill allows user to complete purchase, does it sell items for more than $100 or is average transaction likely to be more than $100? If yes, does the skill provide customers opportunity to set up a four-digit voice code/PIN?** Y/N\n'+

'**Does the skill allow customers to pay their rent through the skill?** \n'+

'If so:\n'+

'*Does the skill give customers the option to set up a four-digit voice code?* Y/N\n'+

'*Does the skill require customers to say their four-digit voice code before checking their rent balance?* Y/N\n'+

'*Does the skill require customers to say their four-digit voice code before paying their rent?* Y/N\n'+

'*If cart-building or wishlist skill, does it instruct customer how to complete order via voice and in the skill description?* Y/N\n'+

'*If non-travel reservation skill, does description mention ability to make a reservation for hotels, rental cars, restaurants, or events?* Y/N\n'+

'***\n'+
'***\n'+
'#### Information for Skill Resolvers (Always Required)\n'+
'***\n'+
'**Concern and Recommendation**\n'+
'[Tester adds their concern and recommendation here]\n'+
'***\n'+
'**Additional CP / CX Test Cases to be marked:**\n'+

'**Date / Time of Latency miss including time zone:**\n'+
'[Tester to either copy over information from IQ Dashboard or use data from workflow History page.\n'+
'E.g.  01/10/2022 12:15 pm +01:00]\n'

                    console.log('Here1')


                    document.body.appendChild(copyTextArea0)
                    console.log('Here2')


                    var log = document.getElementById('copySIDTextArea0').select();
                    document.execCommand("copy");
                    copyTextArea0.parentElement.removeChild(copyTextArea0);
                    console.log('Here3')

                    window.alert("Template with Skill ID, CIC URL, and other information, has been inserted into your clipboard.\n\nPlease paste(Ctrl+v) it into SIM description field instead of default template.");

                    window.open("https://t.corp.amazon.com/create/templates/9dcb012c-e7be-4aea-ad45-32ab8c22945b");


                break;


                case 'ISP':

                    var copyTextArea0 = document.createElement("TEXTAREA");
                    copyTextArea0.id = 'copySIDTextArea0'


                    copyTextArea0.innerHTML =

                    '### [Please click the "Markdown" button below description field before clicking on "Create"]\n'+
'***\n'+
'#### Skill Details (Always Required)\n'+
'***\n'+
'Skill ID: ' +SkillId+ '\n' +
                    'Developer Name:'+devName+' \n' +
                     'Optimus page link: ' +optimus+'\n'+
'**If skill has been assigned as a Sev-3, please explain why:**\n'+
'***\n'+
'**Tier:** Managed/Unmanaged\n'+
'**If managed, who is BD/SA?** \n'+
'**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N\n'+
'***\n'+
'**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?**'+skillType+'\n '+
'**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).\n'+
'**Relevant Test Question:**\n'+
'**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card\n'+
'**Is the content that triggered this escalation in Alexas voice?** Y/N\n'+
'***\n'+
'***\n'+
'#### CX Details (Always Required)\n'+
'***\n'+
'**Invocation Name:**' +invocationName+'\n'+
'**Short Description:**'+ shortDescription +'\n'+
'**Long Description:**' +Description+'\n'+
'**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**\n'+
'***\n'+
'***\n'+
'#### ISP skills specific:\n'+
'***\n'+
'**List of ISP products along with price detail and brief functionality explanation:**\n'+
'**Specify the concern / issue (erase the irrelevant topic):**\n'+
'- Listen to Music (attach the recorded sample of music content)\n'+
'- Listen to Audiobooks\n'+
'- Read eBooks\n'+
'- Control smart home products\n'+
'- Developer having multiple skills with same ISP functionality (*Explain differences and similarities in detail)\n'+
'- Offering cash prizes or other kind of tangible rewards\n'+
'- Other\n'+
'**If “Listen to Music” was selected (erase this if irrelevant):**\n'+

'**Does the skill allows user to select specific music to play?** (Y/N)\n'+
'**Is the music played as a background music?** (Y/N)\n'+

'**Skill interaction on how to reach to the response with the concern:**\n'+
'*(if skill plays audio, please capture it as much as you could)*\n'+
'***\n'+
'***\n'+
'#### Information for Skill Resolvers (Always Required)\n'+
'***\n'+
'**Concern and Recommendation**\n'+
'[Tester adds their concern and recommendation here]\n'+
'***\n'+
'**Additional CP / CX Test Cases to be marked:**\n'+

'**Date / Time of Latency miss including time zone:**\n'+
'[Tester to either copy over information from IQ Dashboard or use data from workflow History page.\n'+
'E.g.  01/10/2022 12:15 pm +01:00]\n'

                    console.log('Here1')


                    document.body.appendChild(copyTextArea0)
                    console.log('Here2')


                    var log = document.getElementById('copySIDTextArea0').select();
                    document.execCommand("copy");
                    copyTextArea0.parentElement.removeChild(copyTextArea0);
                    console.log('Here3')

                    window.alert("Template with Skill ID, CIC URL, and other information, has been inserted into your clipboard.\n\nPlease paste(Ctrl+v) it into SIM description field instead of default template.");

                    window.open("https://t.corp.amazon.com/create/templates/d4d86c8d-9681-4cdc-b701-3e9a0e800ca8");

                break;


                case 'Personal assistant skills':


                    var copyTextArea0 = document.createElement("TEXTAREA");
                    copyTextArea0.id = 'copySIDTextArea0'


                    copyTextArea0.innerHTML =
                  ' ### [Please click the "Markdown" button below description field before clicking on "Create"]\n'+
'***\n'+
'#### Skill Details (Always Required)\n'+
'***\n'+
'Skill ID: ' +SkillId+ '\n' +
                    'Developer Name:'+devName+' \n' +
                     'Optimus page link: ' +optimus+'\n'+
'**If skill has been assigned as a Sev-3, please explain why:**\n'+
'***\n'+
'**Tier:** Managed/Unmanaged\n'+
'**If managed, who is BD/SA?**\n'+
'**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N\n'+
'***\n'+
'**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?**'+skillType+'\n '+
'**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).\n'+
'**Relevant Test Question:**\n'+
'**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card\n'+
'**Is the content that triggered this escalation in Alexas voice?** Y/N\n'+
'***\n'+
'***\n'+
'#### CX Details (Always Required)\n'+
'***\n'+
'**Invocation Name:**' +invocationName+'\n'+
'**Short Description:**'+ shortDescription +'\n'+
'**Long Description:**' +Description+'\n'+
'**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**\n'+
'***\n'+
'***\n'+

'#### Personal assistant skills specific\n'+
'***\n'+
'**Does the skill contain features that crosses 3 or more Alexa domains?** If so, please list which 3 or more domains and the functionality that falls under those domains.\n'+

'*Note: the Alexa Domains are Auto, Communication (messaging, calling, contact), Entertainment (video, music, books, podcasts, games, jokes), Health & Wellness (Medication reminders, Tracking medication refills, Scheduling appointments, Infant measurements), Household Organization (calendar, email, tasks reminders, etc.), Information (web search, maps and traffic, weather, sports, etc.), Shopping (retail, grocery, price comparisons), and Smart Home (Camera, lightning, HVAC, security systems, kitchen)*\n'+
'***\n'+
'***\n'+
'#### Information for Skill Resolvers (Always Required)\\n'+
'***\n'+
'**Concern and Recommendation**\n'+
'[Tester adds their concern and recommendation here]\n'+
'***\n'+
'**Additional CP / CX Test Cases to be marked:**\n'+

'**Date / Time of Latency miss including time zone:**\n'+
'[Tester to either copy over information from IQ Dashboard or use data from workflow History page.\n'+
'E.g.  01/10/2022 12:15 pm +01:00]\n'


                    console.log('Here1')


                    document.body.appendChild(copyTextArea0)
                    console.log('Here2')


                    var log = document.getElementById('copySIDTextArea0').select();
                    document.execCommand("copy");
                    copyTextArea0.parentElement.removeChild(copyTextArea0);
                    console.log('Here3')

                    window.alert("Template with Skill ID, CIC URL, and other information, has been inserted into your clipboard.\n\nPlease paste(Ctrl+v) it into SIM description field instead of default template.");

                    window.open("https://t.corp.amazon.com/create/templates/4521d641-1231-4b6d-a7f4-15cfbeff76b0");

                break;




                case 'CX Escalations':

                    var copyTextArea0 = document.createElement("TEXTAREA");
                    copyTextArea0.id = 'copySIDTextArea0'


                    copyTextArea0.innerHTML =
                    '### [Please click the "Markdown" button below description field before clicking on "Create"]\n'+
'***\n'+

'#### Skill Details (Always Required)\n'+
'***\n'+
'Skill ID: ' +SkillId+ '\n' +
                    'Developer Name:'+devName+' \n' +
                     'Optimus page link: ' +optimus+'\n'+
'**If skill has been assigned as a Sev-3, please explain why:**\n'+
'***\n'+
'**Tier:** Managed/Unmanaged\n'+
'**If managed, who is BD/SA?** \n'+
'**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N\n'+
'***\n'+
'**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?**'+skillType+'\n '+
'**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).\n'+
'**Relevant Test Question:**\n'+
'**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card\n'+
'**Is the content that triggered this escalation in Alexas voice?** Y/N\n'+
'***\n'+
'***\n'+
'#### CX Details (Always Required)\n'+
'***\n'+
'**Invocation Name:**' +invocationName+'\n'+
'**Short Description:**'+ shortDescription +'\n'+
'**Long Description:**' +Description+'\n'+
'**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**\n'+
'***\n'+
'***\n'+
'#### Information for Skill Resolvers (Always Required)\n'+
'***\n'+
'**Concern and Recommendation**\n'+
'[Tester adds their concern and recommendation here]\n'+
'***\n'+
'**Additional CP / CX Test Cases to be marked:**\n'+

'**Date / Time of Latency miss including time zone:**\n'+
'[Tester to either copy over information from IQ Dashboard or use data from workflow History page.\n'+
'E.g.  01/10/2022 12:15 pm +01:00]\n'

                    console.log('Here1')


                    document.body.appendChild(copyTextArea0)
                    console.log('Here2')


                    var log = document.getElementById('copySIDTextArea0').select();
                    document.execCommand("copy");
                    copyTextArea0.parentElement.removeChild(copyTextArea0);
                    console.log('Here3')

                    window.alert("Template with Skill ID, CIC URL, and other information, has been inserted into your clipboard.\n\nPlease paste(Ctrl+v) it into SIM description field instead of default template.");

                    window.open("https://t.corp.amazon.com/create/templates/9aee72fe-293d-4272-a03c-f668a73861ab");

                break;






                case 'personal financial banking':

                    var copyTextArea0 = document.createElement("TEXTAREA");
                    copyTextArea0.id = 'copySIDTextArea0'


                    copyTextArea0.innerHTML =
                    '### [Please click the "Markdown" button below description field before clicking on "Create"]\n'+
'***\n'+
'#### Skill Details (Always Required)\n'+
'***\n'+
'Skill ID: ' +SkillId+ '\n' +
                    'Developer Name:'+devName+' \n' +
                     'Optimus page link: ' +optimus+'\n'+
'**If skill has been assigned as a Sev-3, please explain why:**\n'+
'***\n'+
'**Tier:** Managed/Unmanaged\n'+
'**If managed, who is BD/SA?** \n'+
'**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N\n'+
'***\n'+
'**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?**'+skillType+'\n '+
'**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).\n'+
'**Relevant Test Question:**\n'+
'**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card\n'+
'**Is the content that triggered this escalation in Alexas voice?** Y/N\n'+
'***\n'+
'***\n'+
'#### CX Details (Always Required)\n'+
'***\n'+
'**Invocation Name:**' +invocationName+'\n'+
'**Short Description:**'+ shortDescription +'\n'+
'**Long Description:**' +Description+'\n'+
'**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**\n'+
'***\n'+
'***\n'+
'#### Personal financial/Banking Specific\n'+
'***\n'+
'**Does the skill contain any financial features outside of the list below?** (Y/N)\n'+
' Account Balance\n'+
' Available credit\n'+
' Order Checking \n'+
' Locking Customer’s Credit Card\n'+
' Transfer Funds or Wire transfer\n'+
' E-wallet or Bitcoin wallet\n'+
' Peer to peer payment\n'+

'***\n'+
'***\n'+
'#### Information for Skill Resolvers (Always Required)\n'+
'***\n'+
'**Concern and Recommendation**\n'+
'[Tester adds their concern and recommendation here]\n'+
'***\n'+
'**Additional CP / CX Test Cases to be marked:**\n'+

'**Date / Time of Latency miss including time zone:**\n'+
'[Tester to either copy over information from IQ Dashboard or use data from workflow History page.\n'+
'E.g.  01/10/2022 12:15 pm +01:00]\n'


                    console.log('Here1')
                    document.body.appendChild(copyTextArea0)
                    console.log('Here2')

                    var log = document.getElementById('copySIDTextArea0').select();
                    document.execCommand("copy");
                    copyTextArea0.parentElement.removeChild(copyTextArea0);
                    console.log('Here3')

                    window.alert("Template with Skill ID, CIC URL, and other information, has been inserted into your clipboard.\n\nPlease paste(Ctrl+v) it into SIM description field instead of default template.");

                    window.open("https://t.corp.amazon.com/create/templates/5d76e4f4-90fe-47b6-a528-c78378488724");

                break;

                case 'emergency service skill':

                    var copyTextArea0 = document.createElement("TEXTAREA");
                    copyTextArea0.id = 'copySIDTextArea0'


                    copyTextArea0.innerHTML =

                   '### [Please click the "Markdown" button below description field before clicking on "Create"]\n'+
'***\n'+
'#### Skill Details (Always Required)\n'+
'***\n'+
'Skill ID: '+SkillId+ '\n' +
                    'Developer Name:'+devName+' \n' +
                    'Optimus page link: ' +optimus+'\n'+
'**If skill has been assigned as a Sev-3, please explain why:**\n'+
'***\n'+
'**Tier:** Managed/Unmanaged\n'+
'**If managed, who is BD/SA?** \n'+
'**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N\n'+
'***\n'+
'**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?**'+skillType+'\n '+
'**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).\n'+
'**Relevant Test Question:**\n'+
'**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card\n'+
'**Is the content that triggered this escalation in Alexas voice?** Y/N\n'+
'***\n'+
'***\n'+
'#### CX Details (Always Required)\n'+
'***\n'+
'**Invocation Name:**' +invocationName+'\n'+
'**Short Description:**'+ shortDescription +'\n'+
'**Long Description:**' +Description+'\n'+
'**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**\n'+
'***\n'+
'***\n'+

'#### Emergency services skill specific\n'+
'***\n'+
'1. **Is the skill developed or provided by an established emergency services company, such as American Medical Response (AMR), ADT, or LifeAlert?**\n'+

'2. **Does the skill intend to alert a call center in an emergency or crisis?**\n'+

'3. **Is the skill connected to a personal emergency response system (PERS)?**\n'+


'A personal emergency response system (PERS) allows users to push a button on a battery-powered transmitter to call for help. The transmitter is linked to a console connected to a telephone line. When a user presses the transmitter’s help button, sending a signal to the console, the console automatically dials an emergency number, generally a centralized call center. \n'+

'4. **Does the skill description, example phrases, website, and/or text messages frame the skill as principally for use in emergency situations?**\n'+

'For example, do the example phrases include “call for help” or “send help,” or do the text messages sent to pre-selected contacts note that the customer has an emergency and needs help?\n'+

'**Link to company website:**\n'+

'**Link to Amazon app, iOS app, Google Action if emergency service exists on other stores:**\n'+
'***\n'+
'***\n'+
'#### Information for Skill Resolvers (Always Required)\n'+
'***\n'+
'**Concern and Recommendation**\n'+
'[Tester adds their concern and recommendation here]\n'+
'***\n'+
'**Additional CP / CX Test Cases to be marked:**\n'+

'**Date / Time of Latency miss including time zone:**\n'+
'[Tester to either copy over information from IQ Dashboard or use data from workflow History page.\n'+
'E.g.  01/10/2022 12:15 pm +01:00]\n'


                    console.log('Here1')
                    document.body.appendChild(copyTextArea0)
                    console.log('Here2')

                    var log = document.getElementById('copySIDTextArea0').select();
                    document.execCommand("copy");
                    copyTextArea0.parentElement.removeChild(copyTextArea0);
                    console.log('Here3')

                    window.alert("Template with Skill ID, CIC URL, and other information, has been inserted into your clipboard.\n\nPlease paste(Ctrl+v) it into SIM description field instead of default template.");

                    window.open("https://t.corp.amazon.com/create/templates/7e590a23-5e23-41fa-ada6-5adba27614c1");

                break;



        }

    }

}






function getAlias(){
    var alias = document.querySelectorAll('.app-alias')[0].textContent;
    var alias1 = alias.substring(0, alias.length-1);
    alias1 = ","+alias1;
    return alias1;
}



function getAppId() {
    var pathname = window.location.pathname;
    var appid = pathname.split('/')[3];
    return appid;
}





})();