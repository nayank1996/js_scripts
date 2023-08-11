// ==UserScript==
// @name         TT automater
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Go to Policy TT with required details in one click
// @author       nayankjh@
// @match        https://optimus-prod.aka.amazon.com/skill/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    var $ = window.jQuery
    'use strict';
     setTimeout(function(){
    var childElement = document.createElement('input');
    childElement.id ="tcoButton";
    childElement.setAttribute("style", "position: absolute; top: 1.5%; right:42%; z-index: 3;font-size:10px; border-radius: 8px; margin-left:5px ; padding:2px 3px; background-color:white");
    childElement.className="button danger test_activity_escalate";
    childElement.type="button";
    childElement.value="Go";
    var select = document.createElement('select');
    select.id="tcoSelect";
    var option;
    var inputdata = "All other CP escalations||Rating/Result change on re-submission/version upgrade(only for blr policy certification team)||Healthcare||Rating escalation||IP||Invocation Name Check||Invocation Name Exemption||Personal assistant skills||personal financial/ banking skills||emergency service skill||ISP||Transaction / Retail Shopping / Amazon Pay||Alexa Shopping||Audiobook Escalations||All other CX policies||Child Directed";

    inputdata.split( '||' ).forEach(function(item) {

        option = document.createElement('option');

        option.value = option.textContent = item;

        select.appendChild(option);
});
    select.setAttribute("style", "position: absolute; top: 2%; right:44%; z-index: 3;margin-left: 10px ; font-size: 14px ; color: black");
        document.body.appendChild(select);
        document.body.appendChild(childElement);

        $("#tcoButton").click(function() {
         let url = window.location.href.split('/');
         let urlM = window.location.href
        let local = $("#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(2) > div.ant-col.ant-col-16 > span:nth-child(3) > div > div > div > div").text();
        let devName = $("#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div:nth-child(1) > div.ant-col.ant-col-16 > a:nth-child(2) > span").text()
        let sa = $("#app > section > main > div > div > div > div.ant-row.m-l-lg.m-r-lg.skillDetailArea > div.ant-col.ant-col-18.skillInformationArea.p-r-lg > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.aboutTab > div:nth-child(30) > div > div > div > div.ant-table-content > div > table > tbody > tr:nth-child(1) > td.colAlignment.optimus-text-wordbreak-word").text();
        let bd = $("#app > section > main > div > div > div > div.ant-row.m-l-lg.m-r-lg.skillDetailArea > div.ant-col.ant-col-18.skillInformationArea.p-r-lg > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.aboutTab > div:nth-child(30) > div > div > div > div.ant-table-content > div > table > tbody > tr:nth-child(2) > td.colAlignment.optimus-text-wordbreak-word").text()
         let skillId = url[4];
        let version = url[6];
        //console.log(skillId,version,local);
        let url1 = "https://alexaskillcontent-ca-iad.iad.proxy.amazon.com/api/cops-manifests/certification/" +skillId+"?version="+version;
    $.get(url1, function(data){
var invocationName
var shortDescription
var description
var skillType
var skillName
       // console.log(data);
        skillType = data.skillManifest.skillTypes
          console.log(skillType)
        console.log(devName)
            if(skillType.includes("CUSTOM")){
             invocationName = data.skillManifest.skillManifestFeatures.apis.custom.locales[local].invocationName
            }else{invocationName = ''}
            console.log(invocationName)
            shortDescription = data.skillManifest.skillManifestFeatures.publishingInformation.locales[local].summary;
           console.log('shortDescription:'+ shortDescription)
            description = data.skillManifest.skillManifestFeatures.publishingInformation.locales[local].description;
        console.log(description)
        skillName = data.skillManifest.skillManifestFeatures.publishingInformation.locales[local].name;
        var selectMain= document.getElementById("tcoSelect");
        var tco="";
        tco=selectMain.value;
        switch(tco)
        {
             case 'Child Directed':
                var temp = document.createElement("textarea");
                document.body.appendChild(temp);
                    temp.value =
`### [Please click the "Markdown" button below description field before clicking on "Create"]
***
#### Skill Details (Always Required)
***
**Skill ID:** ${skillId}
**Developer Name:** ${devName}
**Optimus page link:** ${urlM}
**If skill has been assigned as a Sev-3, please explain why:**

**Was this skill identified by a keyword or Tester?**

*If skill was flagged for a Keyword complete the following. Otherwise, put N/A.*

**Flagged Keywords:**
**Location of Keywords:**

**Account Linking:**
**CD Badge:**

*If skill was flagged by a Tester please complete the following. Otherwise, put N/A.*

**What test case caused you to flag this skill for escalation?**

Insert test case 11.1, 11.2, 11.3, 11.4 or 11.5

***
***
#### CX Details (Always Required)
***
**Invocation Name:** ${invocationName}
**Short Description:** ${shortDescription}
**Long Description:** ${description}
**Responses:**
***
***
#### Information for Skill Resolvers (Always Required)
***
**Previous escalations**
[Ticket URL]
[Decisions]

**Concern and Recommendation**
[What is the exact concern?]
[Why is it a concern?]
[Which test cases / SOP does it violate?]
[Recommendation e.g. to mark "Yes" / "No" to specific test case]
***
**Additional CP / CX Test Cases to be marked:**

**Date / Time of Latency miss including time zone:**
[Tester to either copy over information from IQ Dashboard or use data from workflow History page.]
E.g.  01/10/2022 12:15 pm +01:00
***
### Please do not include any further information. This ticket is privileged and confidential and may not be discussed or shared with others.`
                    temp.select();
                    document.execCommand('copy');
                    temp.remove();
     window.open("https://t.corp.amazon.com/create/templates/c6101e02-3901-484d-92fc-edca4465c511");
               break;
                case 'Healthcare':
                 var temp = document.createElement("textarea");
                document.body.appendChild(temp);
                    temp.value =
`### [Please click the "Markdown" button below description field before clicking on "Create"]
***
#### Skill Details (Always Required)
***
**Skill ID:** ${skillId}
**Developer Name:** ${devName}
**Optimus page link:** ${urlM}
**If skill has been assigned as a Sev-3, please explain why:**
***
**If managed, who is BD/SA?** SA -> ${sa} and BD -> ${bd}
**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N
***
**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?** ${skillType}
**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).
**Relevant Test Question:**
**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card
**Is the content that triggered this escalation in Alexa's voice?** Y/N
***
***
#### CX Details (Always Required)
***
**Invocation Name:** ${invocationName}
**Short Description:** ${shortDescription}
**Long Description:** ${description}
**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**
***
***
#### Information for Skill Resolvers (Always Required)
***
**Previous escalations**
[Ticket URL]
[Decisions]

**Concern and Recommendation**
[What is the exact concern?]
[Why is it a concern?]
[Which test cases / SOP does it violate?]
[Recommendation e.g. to mark "Yes" / "No" to specific test case]
***
**Additional CP / CX Test Cases to be marked:**

**Date / Time of Latency miss including time zone:**
[Tester to either copy over information from IQ Dashboard or use data from workflow History page.]
E.g.  01/10/2022 12:15 pm +01:00`
                temp.select();
                    document.execCommand('copy');
                    temp.remove();
     window.open("https://t.corp.amazon.com/create/templates/1e89be99-b173-4138-9b18-89a96de7e55e");
                break;
                case 'Rating escalation':
                var temp = document.createElement("textarea");
                document.body.appendChild(temp);
                    temp.value =
`### [Please click the "Markdown" button below description field before clicking on "Create"]
***
#### Skill Details (Always Required)
***
**Skill ID:** ${skillId}
**Developer Name:** ${devName}
**Optimus page link:** ${urlM}
**If skill has been assigned as a Sev-3, please explain why:**
***
**If managed, who is BD/SA?** SA -> ${sa} and BD -> ${bd}
**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N
***
**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?** ${skillType}
**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).
**Relevant Test Question:**
**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card
**Is the content that triggered this escalation in Alexa's voice?** Y/N
***
***

#### Rating specific Questions (Always Required)
***
**Has this skill previously been reviewed for rating escalation?** If YES, please include the link to TT:

**Content that raised your concern:**

**Question for which skill will be rated Mature/ GS:**
***
***
#### Information for Skill Resolvers (Always Required)
***
**Previous escalations**
[Ticket URL]
[Decisions]

**Concern and Recommendation**
[What is the exact concern?]
[Why is it a concern?]
[Which test cases / SOP does it violate?]
[Recommendation e.g. to mark "Yes" / "No" to specific test case]
***
**Additional CP / CX Test Cases to be marked:**

**Date / Time of Latency miss including time zone:**
[Tester to either copy over information from IQ Dashboard or use data from workflow History page.]
E.g.  01/10/2022 12:15 pm +01:00`
                    temp.select();
                    document.execCommand('copy');
                    temp.remove();
     window.open("https://t.corp.amazon.com/create/templates/25accfe7-4e87-4a60-b050-57e3ef5a36fc");
                break;
                case 'IP':
                 var temp = document.createElement("textarea");
                document.body.appendChild(temp);
                    temp.value =
`### [Please click the "Markdown" button below description field before clicking on "Create"]
***
#### Skill Details (Always Required)
***
**Skill ID:** ${skillId}
**Developer Name:** ${devName}
**Optimus page link:** ${urlM}
**If skill has been assigned as a Sev-3, please explain why:**
***
**If managed, who is BD/SA?** SA -> ${sa} and BD -> ${bd}
**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N
***
**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?** ${skillType}
**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).
**Relevant Test Question:**
**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card
**Is the content that triggered this escalation in Alexa's voice?** Y/N
***
***
#### CX Details (Always Required)
***
**Invocation Name:** ${invocationName}
**Short Description:** ${shortDescription}
**Long Description:** ${description}
**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**
***
***
#### Information for Skill Resolvers (Always Required)
***
**Previous escalations**
[Ticket URL]
[Decisions]

**Concern and Recommendation**
[What is the exact concern?]
[Why is it a concern?]
[Which test cases / SOP does it violate?]
[Recommendation e.g. to mark "Yes" / "No" to specific test case]
***
**Additional CP / CX Test Cases to be marked:**

**Date / Time of Latency miss including time zone:**
[Tester to either copy over information from IQ Dashboard or use data from workflow History page.]
E.g.  01/10/2022 12:15 pm +01:00`
                temp.select();
                    document.execCommand('copy');
                    temp.remove();
     window.open("https://t.corp.amazon.com/create/templates/4d195005-6265-4607-8cd0-bedf386e8387");
                break;
                case 'Audiobook Escalations':
                var temp = document.createElement("textarea");
                document.body.appendChild(temp);
                    temp.value =
`### [Please click the "Markdown" button below description field before clicking on "Create"]
***
#### Skill Details (Always Required)
***
**Skill ID:** ${skillId}
**Developer Name:** ${devName}
**Optimus page link:** ${urlM}
**If skill has been assigned as a Sev-3, please explain why:**
***
**If managed, who is BD/SA?** SA -> ${sa} and BD -> ${bd}
**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N
***
**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?** ${skillType}
**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).
**Relevant Test Question:**
**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card
**Is the content that triggered this escalation in Alexa's voice?** Y/N
***
***
#### CX Details (Always Required)
***
**Invocation Name:** ${invocationName}
**Short Description:** ${shortDescription}
**Long Description:** ${description}
**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**
***
***

#### Audiobook specific Details
***
a.1. **Is the skill entirely in TTS (Alexa or Polly voice)**?
Ans: [Yes/No]

a.2. **If above "a.1." is marked “yes”, is the content religious in nature (e.g., Bible, Bhagavad Gita, Talmud, Hadith, Quran, Vedas, Sutras, Torah)?**
Ans: [Yes/No]
***
b. **Is the skill entirely in recorded audio?**
Ans: [Yes/No]
***
c.1. **Does the skill use BOTH recorded audio and TTS (e.g., skill uses TTS to recite one story and then recorded audio to recite another)?**
Ans: [Yes/No]

c.2. **If above "c.1." is marked "yes" – please share details about when TTS is used and when recorded audio is used.**
Ans:
***
d. **Does the skill include ISP (e.g., to purchase more stories, more character names)?**
Ans: [Yes/No]
***
***
#### Information for Skill Resolvers (Always Required)
***
**Previous escalations**
[Ticket URL]
[Decisions]

**Concern and Recommendation**
[What is the exact concern?]
[Why is it a concern?]
[Which test cases / SOP does it violate?]
[Recommendation e.g. to mark "Yes" / "No" to specific test case]
***
**Additional CP / CX Test Cases to be marked:**

**Date / Time of Latency miss including time zone:**
[Tester to either copy over information from IQ Dashboard or use data from workflow History page.]
E.g.  01/10/2022 12:15 pm +01:00`
                 temp.select();
                    document.execCommand('copy');
                    temp.remove();
     window.open("https://t.corp.amazon.com/create/templates/364c04c5-095c-45e9-8836-fdbd5b24fc32");
                break;
            case 'All other CP escalations':
               var temp = document.createElement("textarea");
                document.body.appendChild(temp);
                    temp.value =
`### [Please click the "Markdown" button below description field before clicking on "Create"]
***
#### Skill Details (Always Required)
***
**Skill ID:** ${skillId}
**Developer Name:** ${devName}
**Optimus page link:** ${urlM}
**If skill has been assigned as a Sev-3, please explain why:**
***
**If managed, who is BD/SA?** SA -> ${sa} and BD -> ${bd}
**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N
***
**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?** ${skillType}
**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).
**Relevant Test Question:**
**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card
**Is the content that triggered this escalation in Alexa's voice?** Y/N
***
***
#### CX Details (Always Required)
***
**Invocation Name:** ${invocationName}
**Short Description:** ${shortDescription}
**Long Description:** ${description}
**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**
***
***
#### Information for Skill Resolvers (Always Required)
***
**Previous escalations**
[Ticket URL]
[Decisions]

**Concern and Recommendation**
[What is the exact concern?]
[Why is it a concern?]
[Which test cases / SOP does it violate?]
[Recommendation e.g. to mark "Yes" / "No" to specific test case]
***
**Additional CP / CX Test Cases to be marked:**

**Date / Time of Latency miss including time zone:**
[Tester to either copy over information from IQ Dashboard or use data from workflow History page.]
E.g.  01/10/2022 12:15 pm +01:00`
                  temp.select();
                    document.execCommand('copy');
                    temp.remove();
     window.open("https://t.corp.amazon.com/create/templates/c13a26b9-3c7e-4b1d-8eda-d2b1aef7c583");
                break;
            case 'Transaction / Retail Shopping / Amazon Pay':
                var temp = document.createElement("textarea");
                document.body.appendChild(temp);
                    temp.value =
 `### [Please click the "Markdown" button below description field before clicking on "Create"]
***
#### Skill Details (Always Required)
***
**Skill ID:** ${skillId}
**Developer Name:** ${devName}
**Optimus page link:** ${urlM}
**If skill has been assigned as a Sev-3, please explain why:**
***
**If managed, who is BD/SA?** SA -> ${sa} and BD -> ${bd}
**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N
***
**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?** ${skillType}
**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).
**Relevant Test Question:**
**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card
**Is the content that triggered this escalation in Alexa's voice?** Y/N
***
***
#### CX Details (Always Required)
***
**Invocation Name:** ${invocationName}
**Short Description:** ${shortDescription}
**Long Description:** ${description}
**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**
***
***
#### Transaction skills specific
***
*Please check the [Retail Shopping / Amazon Pay SOP](https://wiki.labcollab.net/confluence/pages/viewpage.action?pageId=701235573)*
***
**Company Summary:**
***
**Does the skill or company’s business model violate any content policies?**

e.g. controlled substances like alcohol, tobacco, marijuana;  sexual content; hateful or culturally insensitive products

**Does the skill’s invocation name match the company or brand name?** Y/N
***
**Summary of skill functionality:**
***
**If managed skill, did skill participate in beta test?** Y/N

**Example interaction from launch through order completion:**

**Does skill support the cancel intent?**
*not required for cart-building or wishlist skills*

**Does the cancel intent just specify information on how the customer can cancel their order?**

e.g., “to cancel, please call this phone number or email ___

**Can the customer cancel their transaction within the skill?**

**Does the skill confirm that the transaction is complete by (1) voice, (2) home card/SMS, and (3) email (unless it's  a cart building skill and email is not required)?**
*Provide screen shot of home card and email if available*

**If skill allows user to complete purchase, does it sell items for more than $100 or is average transaction likely to be more than $100? If yes, does the skill provide customers opportunity to set up a four-digit voice code/PIN?** Y/N

**Does the skill allow customers to pay their rent through the skill?**

If so:

• *Does the skill give customers the option to set up a four-digit voice code?* Y/N

• *Does the skill require customers to say their four-digit voice code before checking their rent balance?* Y/N

• *Does the skill require customers to say their four-digit voice code before paying their rent?* Y/N

• *If cart-building or wishlist skill, does it instruct customer how to complete order via voice and in the skill description?* Y/N

• *If non-travel reservation skill, does description mention ability to make a reservation for hotels, rental cars, restaurants, or events?* Y/N

***
***
#### Information for Skill Resolvers (Always Required)
***
**Previous escalations**
[Ticket URL]
[Decisions]

**Concern and Recommendation**
[What is the exact concern?]
[Why is it a concern?]
[Which test cases / SOP does it violate?]
[Recommendation e.g. to mark "Yes" / "No" to specific test case]
***
**Additional CP / CX Test Cases to be marked:**

**Date / Time of Latency miss including time zone:**
[Tester to either copy over information from IQ Dashboard or use data from workflow History page.]
E.g.  01/10/2022 12:15 pm +01:00`
                     temp.select();
                    document.execCommand('copy');
                    temp.remove();
     window.open("https://t.corp.amazon.com/create/templates/9dcb012c-e7be-4aea-ad45-32ab8c22945b");
                break;
                case 'ISP':
                var temp = document.createElement("textarea");
                document.body.appendChild(temp);
                    temp.value =
`### [Please click the "Markdown" button below description field before clicking on "Create"]
***
#### Skill Details (Always Required)
***
**Skill ID:** ${skillId}
**Developer Name:** ${devName}
**Optimus page link:** ${urlM}
**If skill has been assigned as a Sev-3, please explain why:**
***
**If managed, who is BD/SA?** SA -> ${sa} and BD -> ${bd}
**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N
***
**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?** ${skillType}
**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).
**Relevant Test Question:**
**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card
**Is the content that triggered this escalation in Alexa's voice?** Y/N
***
***
#### CX Details (Always Required)
***
**Invocation Name:** ${invocationName}
**Short Description:** ${shortDescription}
**Long Description:** ${description}
**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**
***
***
#### ISP skills specific:
***
**List of ISP products along with price detail and brief functionality explanation:**

**Specify the concern / issue (erase the irrelevant topic):**

- Listen to Music (attach the recorded sample of music content)
- Listen to Audiobooks
- Read eBooks
- Control smart home products
- Developer having multiple skills with same ISP functionality (*Explain differences and similarities in detail)
- Offering cash prizes or other kind of tangible rewards
- Other

**If “Listen to Music” was selected (erase this if irrelevant):**

**Does the skill allows user to select specific music to play?** (Y/N)
**Is the music played as a background music?** (Y/N)

**Skill interaction on how to reach to the response with the concern:**
*(if skill plays audio, please capture it as much as you could)*
***
***
#### Information for Skill Resolvers (Always Required)
***
**Previous escalations**
[Ticket URL]
[Decisions]

**Concern and Recommendation**
[What is the exact concern?]
[Why is it a concern?]
[Which test cases / SOP does it violate?]
[Recommendation e.g. to mark "Yes" / "No" to specific test case]
***
**Additional CP / CX Test Cases to be marked:**

**Date / Time of Latency miss including time zone:**
[Tester to either copy over information from IQ Dashboard or use data from workflow History page.]
E.g.  01/10/2022 12:15 pm +01:00`
                 temp.select();
                    document.execCommand('copy');
                    temp.remove();
     window.open("https://t.corp.amazon.com/create/templates/d4d86c8d-9681-4cdc-b701-3e9a0e800ca8");
                break;
                 case 'Personal assistant skills':
                var temp = document.createElement("textarea");
                document.body.appendChild(temp);
                    temp.value =
`### [Please click the "Markdown" button below description field before clicking on "Create"]
***
#### Skill Details (Always Required)
***
**Skill ID:** ${skillId}
**Developer Name:** ${devName}
**Optimus page link:** ${urlM}
**If skill has been assigned as a Sev-3, please explain why:**
***
**If managed, who is BD/SA?** SA -> ${sa} and BD -> ${bd}
**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N
***
**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?** ${skillType}
**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).
**Relevant Test Question:**
**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card
**Is the content that triggered this escalation in Alexa's voice?** Y/N
***
***
#### CX Details (Always Required)
***
**Invocation Name:** ${invocationName}
**Short Description:** ${shortDescription}
**Long Description:** ${description}
**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**
***
***

#### Personal assistant skills specific
***
**Does the skill contain features that crosses 3 or more Alexa domains?** If so, please list which 3 or more domains and the functionality that falls under those domains.

*Note: the Alexa Domains are Auto, Communication (messaging, calling, contact), Entertainment (video, music, books, podcasts, games, jokes), Health & Wellness (Medication reminders, Tracking medication refills, Scheduling appointments, Infant measurements), Household Organization (calendar, email, tasks reminders, etc.), Information (web search, maps and traffic, weather, sports, etc.), Shopping (retail, grocery, price comparisons), and Smart Home (Camera, lightning, HVAC, security systems, kitchen)*
***
***
#### Information for Skill Resolvers (Always Required)
***
**Previous escalations**
[Ticket URL]
[Decisions]

**Concern and Recommendation**
[What is the exact concern?]
[Why is it a concern?]
[Which test cases / SOP does it violate?]
[Recommendation e.g. to mark "Yes" / "No" to specific test case]
***
**Additional CP / CX Test Cases to be marked:**

**Date / Time of Latency miss including time zone:**
[Tester to either copy over information from IQ Dashboard or use data from workflow History page.]
E.g.  01/10/2022 12:15 pm +01:00`
                 temp.select();
                    document.execCommand('copy');
                    temp.remove();
     window.open("https://t.corp.amazon.com/create/templates/4521d641-1231-4b6d-a7f4-15cfbeff76b0");
                break;
                case 'All other CX policies':
                var temp = document.createElement("textarea");
                document.body.appendChild(temp);
                    temp.value =
`### [Please click the "Markdown" button below description field before clicking on "Create"]
***

#### Skill Details (Always Required)
***
**Skill ID:** ${skillId}
**Developer Name:** ${devName}
**Optimus page link:** ${urlM}
**If skill has been assigned as a Sev-3, please explain why:**
***
**If managed, who is BD/SA?** SA -> ${sa} and BD -> ${bd}
**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N
***
**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?** ${skillType}
**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).
**Relevant Test Question:**
**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card
**Is the content that triggered this escalation in Alexa's voice?** Y/N
***
***
#### CX Details (Always Required)
***
**Invocation Name:** ${invocationName}
**Short Description:** ${shortDescription}
**Long Description:** ${description}
**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**
***
***
#### Information for Skill Resolvers (Always Required)
***
**Previous escalations**
[Ticket URL]
[Decisions]

**Concern and Recommendation**
[What is the exact concern?]
[Why is it a concern?]
[Which test cases / SOP does it violate?]
[Recommendation e.g. to mark "Yes" / "No" to specific test case]
***
**Additional CP / CX Test Cases to be marked:**

**Date / Time of Latency miss including time zone:**
[Tester to either copy over information from IQ Dashboard or use data from workflow History page.]
E.g.  01/10/2022 12:15 pm +01:00`
                temp.select();
                    document.execCommand('copy');
                    temp.remove();
     window.open("https://t.corp.amazon.com/create/templates/9aee72fe-293d-4272-a03c-f668a73861ab");
                break;
                case 'personal financial/ banking skills':
                var temp = document.createElement("textarea");
                document.body.appendChild(temp);
                    temp.value =
`### [Please click the "Markdown" button below description field before clicking on "Create"]
***
#### Skill Details (Always Required)
***
**Skill ID:** ${skillId}
**Developer Name:** ${devName}
**Optimus page link:** ${urlM}
**If skill has been assigned as a Sev-3, please explain why:**
***
**If managed, who is BD/SA?** SA -> ${sa} and BD -> ${bd}
**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N
***
**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?** ${skillType}
**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).
**Relevant Test Question:**
**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card
**Is the content that triggered this escalation in Alexa's voice?** Y/N
***
***
#### CX Details (Always Required)
***
**Invocation Name:** ${invocationName}
**Short Description:** ${shortDescription}
**Long Description:** ${description}
**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**
***
***
#### Personal financial/Banking Specific
***
**Does the skill contain any financial features outside of the list below?** (Y/N)
- Account Balance
- Available credit
- Order Checking
- Locking Customer’s Credit Card
- Transfer Funds or Wire transfer
- E-wallet or Bitcoin wallet
- Peer to peer payment

***
***
#### Information for Skill Resolvers (Always Required)
***
**Previous escalations**
[Ticket URL]
[Decisions]

**Concern and Recommendation**
[What is the exact concern?]
[Why is it a concern?]
[Which test cases / SOP does it violate?]
[Recommendation e.g. to mark "Yes" / "No" to specific test case]
***
**Additional CP / CX Test Cases to be marked:**

**Date / Time of Latency miss including time zone:**
[Tester to either copy over information from IQ Dashboard or use data from workflow History page.]
E.g.  01/10/2022 12:15 pm +01:00`
                         temp.select();
                    document.execCommand('copy');
                    temp.remove();
     window.open("https://t.corp.amazon.com/create/templates/5d76e4f4-90fe-47b6-a528-c78378488724");
                break;
                case 'emergency service skill':
                 var temp = document.createElement("textarea");
                document.body.appendChild(temp);
                    temp.value =
`### [Please click the "Markdown" button below description field before clicking on "Create"]
***
#### Skill Details (Always Required)
***
**Skill ID:** ${skillId}
**Developer Name:** ${devName}
**Optimus page link:** ${urlM}
**If skill has been assigned as a Sev-3, please explain why:**
***
**If managed, who is BD/SA?** SA -> ${sa} and BD -> ${bd}
**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N
***
**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?** ${skillType}
**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).
**Relevant Test Question:**
**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card
**Is the content that triggered this escalation in Alexa's voice?** Y/N
***
***
#### CX Details (Always Required)
***
**Invocation Name:** ${invocationName}
**Short Description:** ${shortDescription}
**Long Description:** ${description}
**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**
***
***

#### Emergency services skill specific
***
1. **Is the skill developed or provided by an established emergency services company, such as American Medical Response (AMR), ADT, or LifeAlert?**

2. **Does the skill intend to alert a call center in an emergency or crisis?**

3. **Is the skill connected to a personal emergency response system (PERS)?**


A personal emergency response system (PERS) allows users to push a button on a battery-powered transmitter to call for help. The transmitter is linked to a console connected to a telephone line. When a user presses the transmitter’s help button, sending a signal to the console, the console automatically dials an emergency number, generally a centralized call center.

4. **Does the skill description, example phrases, website, and/or text messages frame the skill as principally for use in emergency situations?**

For example, do the example phrases include “call for help” or “send help,” or do the text messages sent to pre-selected contacts note that the customer has an emergency and needs help?

**Link to company website:**

**Link to Amazon app, iOS app, Google Action if emergency service exists on other stores:**
***
***
#### Information for Skill Resolvers (Always Required)
***
**Previous escalations**
[Ticket URL]
[Decisions]

**Concern and Recommendation**
[What is the exact concern?]
[Why is it a concern?]
[Which test cases / SOP does it violate?]
[Recommendation e.g. to mark "Yes" / "No" to specific test case]
***
**Additional CP / CX Test Cases to be marked:**

**Date / Time of Latency miss including time zone:**
[Tester to either copy over information from IQ Dashboard or use data from workflow History page.]
E.g.  01/10/2022 12:15 pm +01:00`
                    temp.select();
                    document.execCommand('copy');
                    temp.remove();
     window.open("https://t.corp.amazon.com/create/templates/7e590a23-5e23-41fa-ada6-5adba27614c1");
                break;
            case 'Alexa Shopping':
                var temp = document.createElement("textarea");
                document.body.appendChild(temp);
                    temp.value =
`### [Please click the "Markdown" button below description field before clicking on "Create"]
***
#### Skill Details (Always Required)
***
**Skill ID:** ${skillId}
**Developer Name:** ${devName}
**Optimus page link:** ${urlM}
**If skill has been assigned as a Sev-3, please explain why:**
***
**If managed, who is BD/SA?** SA -> ${sa} and BD -> ${bd}
**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N
***
**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?** ${skillType}

**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).
**Relevant Test Question:**
**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card
**Is the content that triggered this escalation in Alexa's voice?** Y/N
***
***
#### CX Details (Always Required)
***
**Invocation Name:** ${invocationName}
**Short Description:** ${shortDescription}
**Long Description:** ${description}
**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**
***
***
#### Alexa Shopping skills specific
***
*Please check the [Retail Shopping / Amazon Pay SOP](https://wiki.labcollab.net/confluence/pages/viewpage.action?pageId=701235573)*
***
**Company Summary:**
***
**Does the skill or company’s business model violate any content policies?**

e.g. controlled substances like alcohol, tobacco;  sexual content; hateful or culturally insensitive products

***
**Summary of skill functionality:**
***
**If managed skill, did skill participate in beta test?** Y/N

**Does the skill have the ALEXA_SHOPPING badge, but does not mention this feature and also has no related functionality?**

**Example interaction from launch through order completion:**

**Relevant Test Questions:**

* **Does the skill use Alexa Shopping actions but the skill description fails to mention the following required disclaimer: “This skill uses Alexa Shopping to make purchases on Amazon. Alexa allows purchasing by voice using your default payment and shipping settings. You can set a voice confirmation code, turn off purchasing, and see product and order details in your Alexa app.”** Y/N

* **If the skill uses Alexa Shopping Actions does it not tell a user how to initiate a cancellation or refund request?** Y/N

* **Does the skill contain child-directed content and failing the CP11.2 policy for not having CDS badge?**
***
***
#### Information for Skill Resolvers (Always Required)
***
**Previous escalations**
[Ticket URL]
[Decisions]

**Concern and Recommendation**
[What is the exact concern?]
[Why is it a concern?]
[Which test cases / SOP does it violate?]
***
**Additional CP / CX Test Cases to be marked:**

**Date / Time of Latency miss including time zone:**
[Tester to either copy over information from IQ Dashboard or use data from workflow History page.]
E.g.  01/10/2022 12:15 pm +01:00`
                temp.select();
                    document.execCommand('copy');
                    temp.remove();
     window.open("https://t.corp.amazon.com/create/templates/78420b32-d5cc-4c54-a3b6-e6895129ddf8");
                break;
               case 'Invocation Name Check':
                var temp = document.createElement("textarea");
                document.body.appendChild(temp);
                    temp.value =
`### [Please click the "Markdown" button below description field before clicking on "Create"]
***
#### Skill Details (Always Required)
***
**Skill ID:** ${skillId}
**Developer Name:** ${devName}
**Optimus page link:** ${urlM}
**If skill has been assigned as a Sev-3, please explain why:**
***
**If managed, who is BD/SA?** SA -> ${sa} and BD -> ${bd}
**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N
***
**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?** ${skillType}
**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).
**Relevant Test Question:**
**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card
**Is the content that triggered this escalation in Alexa's voice?** Y/N
***
***
#### CX Details (Always Required)
***
**Invocation Name:** ${invocationName}
**Short Description:** ${shortDescription}
**Long Description:** ${description}
**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**
***
***
#### Information for Skill Resolvers (Always Required)
***
**Previous escalations**
[Ticket URL]
[Decisions]

**Concern and Recommendation**
[What is the exact concern?]
[Why is it a concern?]
[Which test cases / SOP does it violate?]
[Recommendation e.g. to mark "Yes" / "No" to specific test case]
***
**Additional CP / CX Test Cases to be marked:**

**Date / Time of Latency miss including time zone:**
[Tester to either copy over information from IQ Dashboard or use data from workflow History page.]
E.g.  01/10/2022 12:15 pm +01:00`
                     temp.select();
                    document.execCommand('copy');
                    temp.remove();
     window.open("https://t.corp.amazon.com/create/templates/ec1424a8-c687-456b-8a2e-b05bc47f50a1");
                break;
                case 'Invocation Name Exemption':
                var temp = document.createElement("textarea");
                document.body.appendChild(temp);
                    temp.value =
                        `### [Please click the "Markdown" button below description field before clicking on "Create"]
***
#### Skill Details (Always Required)
***
**Skill ID:** ${skillId}
**Developer Name:** ${devName}
**Optimus page link:** ${urlM}
**If skill has been assigned as a Sev-3, please explain why:**
***
**If managed, who is BD/SA?** SA -> ${sa} and BD -> ${bd}
**If managed, has the BD or SA communicated any PR/marketing related info?** Y, N
***
**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?** ${skillType}
**Are policy concerns NOT being presented through TTS responses?** If so, please upload recorded audio (only for EN, DE, JP).
**Relevant Test Question:**
**Where was the concern was found?** Choose the relevant: Metadata/Response/Home card
**Is the content that triggered this escalation in Alexa's voice?** Y/N
***
***
#### CX Details (Always Required)
***
**Invocation Name:** ${invocationName}
**Short Description:** ${shortDescription}
**Long Description:** ${description}
**Content Violation Sample Response in Dialog/Home Card Content/Metadata:**
***
***
#### Information for Skill Resolvers (Always Required)
***
**Previous escalations**
[Ticket URL]
[Decisions]

**Concern and Recommendation**
[What is the exact concern?]
[Why is it a concern?]
[Which test cases / SOP does it violate?]
[Recommendation e.g. to mark "Yes" / "No" to specific test case]
***
**Additional CP / CX Test Cases to be marked:**

**Date / Time of Latency miss including time zone:**
[Tester to either copy over information from IQ Dashboard or use data from workflow History page.]
E.g.  01/10/2022 12:15 pm +01:00`
                temp.select();
                    document.execCommand('copy');
                    temp.remove();
     window.open("https://t.corp.amazon.com/create/templates/c711e05b-29f4-48a3-abb7-db33a9160cf0");
                break;
                case 'Rating/Result change on re-submission/version upgrade(only for blr policy certification team)':
                var temp = document.createElement("textarea");
                document.body.appendChild(temp);
                    temp.value =`
### [Please click the "Markdown" button below description field before clicking on "Create"]
***
#### **Skill Details (Always Required)**
**Skill Name:** ${skillName}
**Optimus Link:** ${urlM}
**Skill ID:** ${skillId}
**Developer Name:** ${devName}
**Email of the developer:**
***
**Is the skill Custom, Content, Blueprint, SH, or other (if so please specify)?**${skillType}
**Has the skill gone Live?** –
* Rating of the Live version - All ages/GS/Mature OR put NA

**Previous submission rating/result:** All ages/GS/Mature
**Previous version workflow link:**
***
***
#### **CX Details (Always required)**
**Invocation Name:** ${invocationName}
**Short Description:** ${shortDescription}
**Long Description:** ${description}


***
#### **Responses:**
Attachment available? - Yes/No
**Please ensure to attach any audio/doc in the information tab before you escalate**

<Insert responses in Alexa voice>

 ***
####
**Previous escalations**
[Ticket URL]
[Decisions]

**Concern and Recommendation (Always required)**
[What is the exact concern?]
[Why is it a concern?]
[Which test cases / SOP does it violate?]
[Recommendation e.g. to mark "Yes" / "No" to specific test case]

**Previously marked test cases:**

**Current test cases:**

**Date / Time of Latency miss including time zone:**
[Tester to either copy over information from IQ Dashboard or use data from workflow Historys page.]
E.g.  01/10/2022 12:15 pm +01:00`
                        temp.select();
                    document.execCommand('copy');
                    temp.remove();
     window.open("https://t.corp.amazon.com/create/templates/933a9d23-f19b-4c75-b149-a2b7c69d3452");
                break;
            default: console.log('default');
        }

        })
        })
         },8000);
})();