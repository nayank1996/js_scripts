// ==UserScript==
// @name         Optimus Suite latest
// @namespace    http://tampermonkey.net/
// @version      1.50.0
// @updateURL    https://drive.corp.amazon.com/view/Alexa%20Cetification%20Docs/Automation%20Script%20Library/%5BOptimus%5D%20OptimusSuite.user.js
// @description  Combines multiple Optimus scripts into one. Please visit https://wiki.labcollab.net/confluence/display/COPS/TamperMonkey+Scripts for more information.
// @author       juaortj (creator), adjonat, himdurga, virashmi, nayankjh
// @require      https://code.jquery.com/jquery-1.11.1.min.js
// @require      https://code.jquery.com/ui/1.11.1/jquery-ui.min.js
// @require      https://cdn.jsdelivr.net/gh/feliciakrismanta/googoose@v0.2-alpha/jquery.googoose.js
// @match        https://*.aka.amazon.com/activityDetail/*
// @match        https://optimus-preprod.aka.amazon.com/activityList/skill/*
// @match        https://optimus-prod.aka.amazon.com/activityList/skill/*
// @match        https://optimus-preprod.aka.amazon.com/skill/*
// @match        https://optimus-prod.aka.amazon.com/skill/*
// @match        https://skillcert-preprod.aka.amazon.com/*
// @match        https://wiki.labcollab.net/*
// @include      https://ask-skill-enabler.amazon.com/*
// @include      https://wiki.labcollab.net/*
// @connect      skillcert-preprod.aka.amazon.com
// @connect      skillcert.aka.amazon.com
// @connect      alexacertquantum-gamma-iad.iad.proxy.amazon.com
// @connect      alexa-skills-sams-iad.iad.proxy.amazon.com
// @connect      alexa-skills-sams-gamma-iad.iad.proxy.amazon.com
// @connect      alexacertquantum.aka.amazon.com
// @connect      alexa-skills-mrcs-iad.iad.proxy.amazon.com
// @connect      issues-staging.labcollab.net
// @connect      issues.labcollab.net
// @connect      wiki.labcollab.net
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    const isOptimusActivityOverview = /.aka.amazon.com\/activityList/.test(window.location.href);
    const isOptimusSingleActivity = /.aka.amazon.com\/activityDetail/.test(window.location.href);
    const isOptimusSkillPreProd = /optimus-preprod.aka.amazon.com\/skill/.test(window.location.href);
    const isOptimusSkillProd = /optimus-preprod.aka.amazon.com\/skill/.test(window.location.href);
    const isCICProd = /skillcert.aka/.test(window.location.href);
    const isCICPreprod = /skillcert-preprod.aka/.test(window.location.href);
    const isOptimusPreprod = /optimus-preprod.aka/.test(window.location.href);
    const isOptimusProd = /optimus-prod.aka/.test(window.location.href);
    const isSkillEnabler = /ask-skill-enabler/.test(window.location.href);
    let localesJSON = {};
    let certMngrId, skillId, skillName, skillVersion, statusObserver, copyOverObserver, afgModalElement, currentActivityId, currentLocale;

    function getCertMngrId() {
        return certMngrId;
    }

    function getSkillId() {
        return skillId;
    }

    function getSkillVersion() {
        return skillVersion;
    }

    /*
     * If the page is the Optimus Skill page, add the managed cert buttons
     */
    if (isOptimusSkillPreProd || isOptimusSkillProd) {
        optimusCertButtons();
    }

    /*
     * If the page is the Optimus Activity list page, then set the values needed, and run the two mutation
     * observers required for the functions.
     */
    if (isOptimusActivityOverview) {
        certMngrId = (/\?certMngrId=(...*)/g).exec(window.location.href)[1];
        skillId = (/skill\/(..*)\/version/g).exec(window.location.href)[1];
        skillVersion = (/version\/(\d*)/g).exec(window.location.href)[1];

        statusObserver = new MutationObserver(statusObserverAddListener);
        copyOverObserver = new MutationObserver(copyOverAddListener);

        copyOverObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        statusObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /*
     * If the page is the detail for a single activity, then run the corresponding scripts.
     */
    if (isOptimusSingleActivity) {
        certMngrId = (/\/certMngr\/(...*)\/skill/g).exec(window.location.href)[1];
        skillId = (/skill\/(..*)\/activity/g).exec(window.location.href)[1];
        skillVersion = (/version\/(\d*)/g).exec(window.location.href)[1];
        currentActivityId = (/activity\/(...*)\/version/g).exec(window.location.href)[1];

        runBlurbCopier();
        runResultAllButtons();
        showSOPLink();
    }

    /*
     * If the page is CIC or CIC Preprod, then run the widget script. If it is Skill Enabler, the widget tool script portion will run and pre-fill the CID and skillID.
     */
    if (isCICProd || isCICPreprod || isSkillEnabler) {
        runOptimusWidgetButton();
    }

    /*
     * Mutation observer that the CopyOver function will use to make sure that the
     * task being performed is the Copy Over feature.
     */
    function copyOverAddListener() {

        // Check if the "Paste Results" button appears. If it does, it means that a copy over function is being performed.
        let pasteBtns = Array.from(document.getElementsByClassName('ant-btn-danger'));
        if (pasteBtns.length !== 0) {
            pasteBtns.forEach(element => {
                if (element.firstChild.textContent === 'Paste Results') {
                    copyOverObserver.disconnect();
                    element.addEventListener('click', runCopyOverPlus);
                }
            });
        }
    }
    /*
     * -----------------------------------------------------------------------------------------
     */

     /*
     * Mutation observer for Activity Status, Activity Overrider, Activity Assigner and AFGTool. If the observer detects
     * activity rows, it will disconnect and trigger the corresponding functions.
     */
    async function statusObserverAddListener() {
        let activityRows = document.querySelectorAll('.ant-table-row');

        if (activityRows.length > 0) {
            skillName = document.querySelector('.skillInfo-header').textContent;
            statusObserver.disconnect();
            runActivityAssigner();
            runPublishDateNotification();
            createActivitiesJSON(activityRows);
            await processActivities();
            runAfgTool();
        }

        async function processActivities() {
            $('.ant-table-tbody').click(() => {
                var blurred = false;
                window.onblur = () => { blurred = true; };
                // window.onfocus = () => { blurred && (location.reload()); };
            });
            activityRows.forEach(async (rowActivity) => {
                let counter = 1;
                let rowAlias = rowActivity.children[4].textContent.slice(0, -1);
                let rowActivityId = rowActivity.getAttribute('data-row-key');
                let rowActivityLocale = rowActivity.children[2].textContent;
                let rowActivityType = rowActivity.children[0].textContent;
                let rowStatus = rowActivity.children[1].textContent;

                await runActivityStatus(rowActivity, rowActivityId, rowActivityLocale, rowActivityType, counter);
                runActivityOverrider(rowActivity, rowActivityId, rowAlias, rowStatus);
            });
            return new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    /*
     * -----------------------------------------------------------------------------------------
     */

    /*
     * CopyOverPlus - auto-completes (finishes) any selected activities when performing
     * the CopyOver function in Optimus. Will not work if there are any failing cases in
     * the activity that's being copied from or if the test cases do not match from the activity
     * which they are being copied over from.
     */
    async function runCopyOverPlus() {
        let completedActivityTestCases = [];
        let totalTestCases = [];
        let certStrategy;
        let policyTestCaseResults = {"certStrategy":`${certStrategy}`,"locales":[],"testResults":[],"skillId":`${getSkillId()}`,"skillVersion":`${getSkillVersion()}`,"tenantId":"optimus-ui"};
        let testCasesFailed = false;
        let manualComplete = false;
        let activityRiskMitigationJSON;
        let completedTestCasesUrl;
        let totalTestCasesUrl;
        let maturityRatingResults;
        let countryExclusionResults;
        let activityDevicesList;
        let testCaseCategories;

        let localeDictFunctional = {
            'English AU' : ['en_AU', 'English (AU)', '', 0],
            'English CA' : ['en_CA', 'English (CA)', '', 0],
            'English GB' : ['en_GB', 'English (GB)', '', 0],
            'English IN' : ['en_IN', 'English (IN)', '', 0],
            'English US' : ['en_US', 'English (US)', '', 0],
            'French CA' : ['fr_CA', 'French (CA)', '', 0],
            'French FR' : ['fr_FR', 'French (FR)', '', 0],
            'German DE' : ['de_DE', 'German (DE)', '', 0],
            'Hindi IN' : ['hi_IN', 'Hindi (IN)', '', 0],
            'Italian IT' : ['it_IT', 'Italian (IT)', '', 0],
            'Japanese JP' : ['ja_JP', 'Japanese (JP)', '', 0],
            'Portuguese BR' : ['pt_BR', 'Portuguese (BR)', '', 0],
            'Spanish ES' : ['es_ES', 'Spanish (ES)', '', 0],
            'Spanish MX' : ['es_MX', 'Spanish (MX)', '', 0],
            'Spanish US' : ['es_US', 'Spanish (US)', '', 0]
        };
        window.activitiesFailedTestCases = '';
        window.activitiesManualCompleteRequired = '';

        // The activity type title in the Copy Over Results window that opens up when you click on the Copy Over button
        let copyOverActivityType = (/: (.*)/g).exec($('h6.copyOverActivityTitle')[0].textContent)[1];

        // Creates an empty array to store all of the activities which will have copy over performed on. The "Paste To" column
        let pasteToActivities = [];

        //Creates a collection of all the available activity rows for the specific skill
        let activityRows = document.querySelectorAll('.ant-table-row');

        // Creates an array of all of the rows to be used for copy over
        let copyOverRows = Array.from(document.querySelectorAll('.ant-select-dropdown.ant-select-dropdown'));
        copyOverRows.shift();
        console.log(copyOverRows);

        copyOverRows.forEach(row => {
            // Create an array of all of the selected activities to be copied over to
            Array.from(row.querySelectorAll('.ant-select-dropdown-menu-item-selected')).forEach(element => {
                pasteToActivities.push(element.textContent);
            });
        });

        pasteToActivities.forEach(pasteToLocale => {
            console.log(pasteToLocale);
            let activityId;
            let extractedLocale = (/(.*)-/g).exec(pasteToLocale)[1];
            let extractedDevice = (/-(.*)/g).exec(pasteToLocale)[1];
            // Specifies the locale for the copy over activity, converted into a format that can be compared with the flow's locale (ie. from English AU-ECHO to English (AU))
            let copyOverLocale = localeDictFunctional[`${extractedLocale}`][1];
            // Specifies the shorthand locale for the copy over activity (en_US, fr_FR, es_ES, etc.)
            let shortHandLocale = localeDictFunctional[`${extractedLocale}`][0];

            if (extractedDevice !== 'BISHOP') {
                // This loop serves only to fetch the activity ID to be used for the current "Paste To" activity
                activityRows.forEach(data => {
                    let rowActivityType = data.children[0].textContent;
                    let rowActivityLocale = data.children[2].textContent;


                    if (copyOverActivityType.toLowerCase() === rowActivityType.toLowerCase() && rowActivityLocale.toLowerCase() === copyOverLocale.toLowerCase()) {
                        activityId = data.getAttribute('data-row-key');
                    }
                    else if (copyOverActivityType.toLowerCase() === 'policy') {
                        if (rowActivityType.toLowerCase() === 'content policy' && rowActivityLocale.toLowerCase() === copyOverLocale.toLowerCase()) {
                            activityId = data.getAttribute('data-row-key');
                        }
                    }
                    else if (copyOverActivityType.toLowerCase() === 'cxpolicy') {
                        if (rowActivityType.toLowerCase() === 'cx' && rowActivityLocale.toLowerCase() === copyOverLocale.toLowerCase()) {
                            activityId = data.getAttribute('data-row-key');
                        }
                    }
                });

                switch (shortHandLocale) {
                    case 'en_AU':
                    case 'en_CA':
                    case 'en_GB':
                    case 'en_IN':
                    case 'en_US':
                    case 'de_DE':
                    case 'es_MX':
                    case 'es_ES':
                    case 'es_US':
                    case 'fr_CA':
                    case 'fr_FR':
                    case 'hi_IN':
                    case 'it_IT':
                    case 'ja_JP':
                    case 'pt_BR':
                        localeDictFunctional[`${extractedLocale}`][3]++;
                        break;
                    default:
                        console.log('Testing switch statement.');
                }

                localeDictFunctional[`${extractedLocale}`][2] = activityId;
            }
        });

        await completeActivity(localeDictFunctional);
        showActivitiesNotCompleted();

        copyOverObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        async function completeActivity(localeDictFunctional) {
            for (const [key, value] of Object.entries(localeDictFunctional)) {
                if (value[3] >= 1) {
                    totalTestCases.length = 0;
                    completedActivityTestCases.length = 0;
                    await loadTotalTestCases(value[2])
                        .then(() => {
                            loadCompletedActivityTestCases(value[0], value[2]);
                            return new Promise(resolve => setTimeout(resolve, 2000));
                        })
                        .then(() => {
                            compareTestCases(value[0], value[2]);
                            return new Promise(resolve => setTimeout(resolve, 1000));
                        });
                }
            }
            return new Promise(resolve => setTimeout(resolve, 2000));
        }

        async function loadTotalTestCases(singleActivityId) {
            console.log("loadTotalTestCases Total test cases: " + totalTestCases.length);
            console.log("loadTotalTestCases Completed test cases: " + completedActivityTestCases.length);

            if (isOptimusPreprod) {
                totalTestCasesUrl = `https://alexa-skills-sams-gamma-iad.iad.proxy.amazon.com/api/activityId/${singleActivityId}/activity`;
            } else if (isOptimusProd) {
                totalTestCasesUrl = `https://alexa-skills-sams-iad.iad.proxy.amazon.com/api/activityId/${singleActivityId}/activity`;
            }

            GM_xmlhttpRequest({
                method: "GET",
                headers: { "Content-Type": "application/json" },
                url: totalTestCasesUrl,
                onload: async function (response) {
                    certStrategy = JSON.parse(response.responseText).mitigationStrategy;
                    activityDevicesList = Array.from(JSON.parse(response.responseText).devicesList);
                    testCaseCategories = Array.from(JSON.parse(response.responseText).taskMetadata.riskMetadata);
                    console.log(JSON.parse(response.responseText))

                    testCaseCategories.forEach(category => {
                        category.risks.forEach(data => {
                            if (copyOverActivityType.toLowerCase() === 'functional' && data.mitigationStrategy !== 'AUTO_PASS') {
                                if (data.applicableDevices.length > 1) {
                                    data.applicableDevices.forEach(device => {
                                        totalTestCases.push(device);
                                    });
                                }
                                else {
                                    totalTestCases.push(data.applicableDevices);
                                }
                            }
                            else if (copyOverActivityType.toLowerCase() === 'slu' && data.mitigationStrategy !== 'AUTO_PASS') {
                                if (data.applicableDevices.length > 1) {
                                    data.applicableDevices.forEach(device => {
                                        totalTestCases.push(device);
                                    });
                                }
                                else {
                                    totalTestCases.push(data.applicableDevices);
                                }
                            }
                            else if (copyOverActivityType.toLowerCase() === 'security' && data.mitigationStrategy !== 'AUTO_PASS') {
                                if (data.applicableDevices.length > 1) {
                                    data.applicableDevices.forEach(device => {
                                        totalTestCases.push(device);
                                    });
                                }
                                else {
                                    totalTestCases.push(data.applicableDevices);
                                }
                            }
                            else if (copyOverActivityType.toLowerCase() === 'policy') {
                                activityDevicesList.forEach(deviceItem => {
                                    if (data.applicableDevices.length > 1) {
                                        data.applicableDevices.forEach(applicableDeviceItem => {
                                            if (applicableDeviceItem === deviceItem) {
                                                totalTestCases.push(applicableDeviceItem);
                                            }
                                        });
                                    }
                                    else {
                                        totalTestCases.push(data.applicableDevices);
                                    }
                                })
                            }
                            else if (copyOverActivityType.toLowerCase() === 'cxpolicy') {
                                activityDevicesList.forEach(deviceItem => {
                                    if (data.applicableDevices.length > 1) {
                                        data.applicableDevices.forEach(applicableDeviceItem => {
                                            if (applicableDeviceItem === deviceItem) {
                                                totalTestCases.push(applicableDeviceItem);
                                            }
                                        });
                                    }
                                    else {
                                        totalTestCases.push(data.applicableDevices);
                                    }
                                })
                            }
                        });
                    });
                }
            });
            return new Promise(resolve => setTimeout(resolve, 2000));
        }

        async function loadCompletedActivityTestCases(shortHandLocale, singleActivityId) {

            if (isOptimusPreprod) {
                completedTestCasesUrl = `https://alexacertquantum-gamma-iad.iad.proxy.amazon.com/api/risk-mitigation/results/query/skill/${getSkillId()}/version/${getSkillVersion()}/OPTIMUS/draft/certification?certMngrId=${getCertMngrId()}&locale=${shortHandLocale}&activityId=${singleActivityId}&includeAuditedActivity=undefined`;
            } else if (isOptimusProd) {
                completedTestCasesUrl = `https://alexacertquantum.aka.amazon.com/api/risk-mitigation/results/query/skill/${getSkillId()}/version/${getSkillVersion()}/OPTIMUS/draft/certification?certMngrId=${getCertMngrId()}&locale=${shortHandLocale}&activityId=${singleActivityId}&includeAuditedActivity=undefined`;
            }

            GM_xmlhttpRequest({
                method: "GET",
                headers: { "Content-Type": "application/json" },
                url: completedTestCasesUrl,
                onload: function (response) {
                    activityRiskMitigationJSON = Array.from(JSON.parse(response.responseText));
                    console.log("Completed Test Cases URL: " + completedTestCasesUrl);
                    console.log(activityRiskMitigationJSON);

                    activityRiskMitigationJSON.forEach(testCase => {
                        policyTestCaseResults.testResults.push({"riskId":`${testCase.riskId}`,"locale":`${shortHandLocale.replace("_","-")}`,"result":`${testCase.result}`});

                        if (copyOverActivityType.toLowerCase() !== 'policy' && copyOverActivityType.toLowerCase() !== 'cxpolicy') {
                            if (testCase.result === 'No') {
                                testCasesFailed = true;
                            }
                        } else {
                            if (testCase.result === 'Yes' && !isNullOrWhitespace(testCase.developerFeedback)) {
                                testCasesFailed = true;
                            }
                        }
                        completedActivityTestCases.push(testCase);
                    });

                    if (copyOverActivityType.toLowerCase() === 'policy') {

                        GM_xmlhttpRequest({
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            url: 'https://alexa-skills-mrcs-iad.iad.proxy.amazon.com/api/maturityrating/risk/marketplace/test-results-ui',
                            data: JSON.stringify(policyTestCaseResults),
                            onload: function (response) {
                                maturityRatingResults = JSON.parse(response.responseText).localeMarketPlaceRatings[shortHandLocale.replace("_","-")];
                            }
                        })

                        GM_xmlhttpRequest({
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            url: 'https://alexa-skills-mrcs-iad.iad.proxy.amazon.com/api/countryexclusion/risk/test-results-ui',
                            data: JSON.stringify(policyTestCaseResults),
                            onload: function (response) {
                                countryExclusionResults = JSON.parse(response.responseText).excludedCountries;
                            }
                        })

                    }

                    if (totalTestCases.length !== completedActivityTestCases.length) {
                        manualComplete = true;
                    }

                }
            })

        }

        function compareTestCases(shortHandLocale, singleActivityId) {
            let riskMitigationCompleteUrl;
            let contentPolicyData = {"activityId":singleActivityId,"activityMetadata":{"marketPlaceRatings":maturityRatingResults,"excludedCountries":countryExclusionResults}};

            if (isOptimusPreprod) {
                riskMitigationCompleteUrl = `https://alexacertquantum-gamma-iad.iad.proxy.amazon.com/api/risk-mitigation/results/save/OPTIMUS/certMngrId/${getCertMngrId()}/completed/${singleActivityId}`;
            } else if (isOptimusProd) {
                riskMitigationCompleteUrl = `https://alexacertquantum.aka.amazon.com/api/risk-mitigation/results/save/OPTIMUS/certMngrId/${getCertMngrId()}/completed/${singleActivityId}`;
            }

            let activityCompleteUrl;
            if (isOptimusPreprod) {
                activityCompleteUrl = `https://alexa-skills-sams-gamma-iad.iad.proxy.amazon.com/api/activity/complete`;
            } else if (isOptimusProd) {
                activityCompleteUrl = `https://alexa-skills-sams-iad.iad.proxy.amazon.com/api/activity/complete`;
            }

            console.log("Total test cases: " + totalTestCases.length);
            console.log("Completed test cases: " + completedActivityTestCases.length);
            console.log("Test Cases failed?: " + testCasesFailed);
            console.log("Manual completion needed?: " + manualComplete);

            if (totalTestCases.length === completedActivityTestCases.length && !testCasesFailed && !manualComplete) {
                console.log('This activity is complete!');

                GM_xmlhttpRequest({
                    method: "POST",
                    url: riskMitigationCompleteUrl,
                    data: JSON.stringify(completedActivityTestCases),
                    headers: {"Content-Type": "application/json"},
                    onload: function (response) {
                        console.log(response.responseText);
                    }
                });

                if (copyOverActivityType.toLowerCase() === 'policy') {
                    console.log("Using method for policy activity");
                    GM_xmlhttpRequest({
                        method: "PUT",
                        url: activityCompleteUrl,
                        data: JSON.stringify(contentPolicyData),
                        headers: {"Content-Type": "application/json"},
                        onload: function (response) {
                            console.log(response.responseText);
                        }
                    });
                } else {
                    console.log("Using non-policy method");
                    GM_xmlhttpRequest({
                        method: "PUT",
                        url: activityCompleteUrl,
                        data: `{"activityId":"${singleActivityId}","activityMetadata":{"activityId":"${singleActivityId}"}}`,
                        headers: {"Content-Type": "application/json"},
                        onload: function (response) {
                            console.log(response.responseText);
                        }
                    });
                }

            } else {
                if (testCasesFailed) {
                    window.activitiesFailedTestCases += `${shortHandLocale} ${copyOverActivityType}\n`;
                } else {
                    window.activitiesManualCompleteRequired += `${shortHandLocale} ${copyOverActivityType}\n`;
                }
            }
        }

        function showActivitiesNotCompleted() {
            console.log("Failed Activities: " + window.activitiesFailedTestCases);
            console.log("Activities that need Manual completion: " + window.activitiesManualCompleteRequired);
            if (!isNullOrWhitespace(window.activitiesFailedTestCases)) {
                console.log("Fail_Message");
                let selection = confirm("Some test cases have failed and the activity cannot be automatically completed. Please open the activities below and review all cases and manually finish them.\n\n" + window.activitiesFailedTestCases);
                if (selection) {
                    reloadPage();
                }
            } else {
                console.log("No activity issues.")
                reloadPage();
            }
            if (!isNullOrWhitespace(window.activitiesManualCompleteRequired)) {
                console.log("Manual_Complete_Message")
                let selection = confirm('These activities still have some test cases that need manual completion. Please click on the activity and review all cases and manually finish it.\n\n' + window.activitiesManualCompleteRequired);
                if (selection) {
                    reloadPage();
                }
            } else {
                console.log("No activity issues.")
                reloadPage();
            }
        }

    }
    /*
     * ----------------------------------------------------------------------------------------
     */

    /*
     * Activity Assigner - This simplifies assigning activities to yourself a little more.
     * Just click on the buttons at the top of the bar to assign Unassigned, In Progress, or All
     * activities to yourself with one click.
     */
    function runActivityAssigner() {
        let activitiesInProgress = [];
        let activitiesUnassigned = [];
        let activitiesAll = [];
        let assignerUrl;

        if (isOptimusPreprod) {
            assignerUrl = `https://alexa-skills-sams-gamma-iad.iad.proxy.amazon.com/api/activity/assign`;
        } else if (isOptimusProd) {
            assignerUrl = `https://alexa-skills-sams-iad.iad.proxy.amazon.com/api/activity/assign`;
        }

        workflowAssignerText('Activity Assigner:');
        activityAllButton('All Activities', selectAllActivityListButtonFn);
        activityInprogressButton('In Progress', selectInprogressActivityListButtonFn);
        activityUnassignedButton('Unassigned', selectUnassignedActivityListButtonFn);

        function workflowAssignerText(text) {
            let textElement = document.createElement('SPAN');
            textElement.innerHTML = text;
            textElement.setAttribute('style', "position: absolute; top: 2%; right:36%; z-index: 3; color: white");
            document.body.appendChild(textElement);
        }

        function activityAllButton(text, onclick) {
            let cssObj = {position: 'absolute', top: '1.5%', right:'20%', width: '4%', 'z-index': 3, 'font-size': '.58vw', padding: '0px'};
            let button = document.createElement('a'), btnStyle = button.style;
            button.classList.add('ant-btn');
            topBarElement = document.querySelector('.ant-row-flex');
            button.text = text;
            button.onclick = onclick;
            Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
            topBarElement.appendChild(button);
        }

        function activityInprogressButton(text, onclick) {
            let cssObj = {position: 'absolute', top: '1.5%', right:'25%', width: '4%', 'z-index': 3, 'font-size': '.58vw', padding: '0px'};
            let button = document.createElement('a'), btnStyle = button.style;
            button.classList.add('ant-btn');
            topBarElement = document.querySelector('.ant-row-flex');
            button.text = text;
            button.onclick = onclick;
            Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
            topBarElement.appendChild(button);
        }

        function activityUnassignedButton(text, onclick) {
            let cssObj = {position: 'absolute', top: '1.5%', right:'29.75%', width: '4%', 'z-index': 3, 'font-size': '.58vw', padding: '0px'};
            let button = document.createElement('a'), btnStyle = button.style;
            button.classList.add('ant-btn');
            topBarElement = document.querySelector('.ant-row-flex');
            button.text = text;
            button.onclick = onclick;
            Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
            topBarElement.appendChild(button);
        }

        function selectAllActivityListButtonFn() {
            let alias = getAlias();
            let activityRows = document.querySelectorAll('.ant-table-row');

            activityRows.forEach(element => {
                let rowAlias = element.children[4].textContent.slice(0, -1);
                let rowActivityId = element.getAttribute('data-row-key');
                if (rowAlias !== alias) {
                    activitiesAll.push(`{"activityId":"${rowActivityId}","posixUsername":"${alias}@ANT.AMAZON.COM"}`);
                }
            });
            if (activitiesAll.length > 0) {
                let selection = confirm("Click OK to assign all activities to yourself \n\n");
                if (selection) {
                    let activitiesData = activitiesAll.toString();
                    GM_xmlhttpRequest({
                        method: "PUT",
                        url: assignerUrl,
                        data: `[${activitiesData}]`,
                        headers: {"Content-Type": "application/json"},
                        onload: function (response) {
                            console.log(response.responseText);
                        }
                    });
                    setTimeout(reloadPage, 3000);
                }
            } else if (activitiesAll.length <= 0) {
                let selection = confirm("No available activities to assign to yourself. \n\n");
            }
        }

        function selectInprogressActivityListButtonFn() {
            let alias = getAlias();
            let activityRows = document.querySelectorAll('.ant-table-row.in-progress');

            activityRows.forEach(element => {
                let rowAlias = element.children[4].textContent.slice(0, -1);
                let rowActivityId = element.getAttribute('data-row-key');
                if (rowAlias !== alias) {
                    activitiesInProgress.push(`{"activityId":"${rowActivityId}","posixUsername":"${alias}@ANT.AMAZON.COM"}`);
                }
            });
            if (activitiesInProgress.length > 0) {
                let selection = confirm("Click OK to assign all In Progress activities to yourself \n\n");
                if (selection) {
                    let activitiesData = activitiesInProgress.toString();
                    GM_xmlhttpRequest({
                        method: "PUT",
                        url: assignerUrl,
                        data: `[${activitiesData}]`,
                        headers: {"Content-Type": "application/json"},
                        onload: function (response) {
                            console.log(response.responseText);
                        }
                    });
                    setTimeout(reloadPage,3000);
                }
            } else if (activitiesInProgress.length <= 0) {
                let selection = confirm("No available In Progress activities to assign to yourself. \n\n");
            }

        }

        function selectUnassignedActivityListButtonFn() {
            let alias = getAlias();
            let activityRows = document.querySelectorAll('.ant-table-row.ready.ant-table-row-level-0');

            activityRows.forEach(element => {
                let rowAlias = element.children[4].textContent.slice(0, -1);
                let rowActivityId = element.getAttribute('data-row-key');
                if (rowAlias !== alias) {
                    activitiesUnassigned.push(`{"activityId":"${rowActivityId}","posixUsername":"${alias}@ANT.AMAZON.COM"}`);
                }
            });
            if (activitiesUnassigned.length > 0) {
                let selection = confirm("Click OK to assign all Unassigned activities to yourself \n\n");
                if (selection) {
                    let activitiesData = activitiesUnassigned.toString();
                    GM_xmlhttpRequest({
                        method: "PUT",
                        url: assignerUrl,
                        data: `[${activitiesData}]`,
                        headers: {"Content-Type": "application/json"},
                        onload: function (response) {
                            console.log(response.responseText);
                        }
                    });
                    setTimeout(reloadPage,3000);
                }
            } else if (activitiesUnassigned.length <= 0) {
                let selection = confirm("No available Unassigned activities to assign to yourself. \n\n");
            }

        }

        function getAlias(){
            let alias = document.querySelectorAll('.app-alias')[0].textContent.slice(0, -1);
            return alias;
        }

    }
    /*
     * -----------------------------------------------------------------------------------------
     */

    /*
     * Activity Overrider - Adds an "Override" button to any completed activities that are
     * assigned to someone else and allows the user to edit the activity.
     */
    function runActivityOverrider(rowActivity, rowActivityId, rowAlias, rowStatus) {
        let overrideBtn = document.createElement('button');
        let alias = document.querySelectorAll('.app-alias')[0].textContent.slice(0, -1);

        overrideBtn.innerHTML = 'Override';
        overrideBtn.setAttribute('id', `${rowActivityId}`);
        overrideBtn.addEventListener('click', function() {overrideActivity(rowActivityId);});

        if (rowStatus === 'Completed' && rowAlias !== alias && rowAlias !== 'AUTOBO') {
            rowActivity.removeAttribute('class', 'view-disabled');
            rowActivity.children[6].appendChild(overrideBtn);
        }

        function overrideActivity(rowActivityId) {
            let riskMitigationResultsUrl;
            if (isOptimusPreprod) {
                riskMitigationResultsUrl = `https://alexacertquantum-gamma-iad.iad.proxy.amazon.com/api/risk-mitigation/results/edit/OPTIMUS/certMngrId/${getCertMngrId()}/completed/${rowActivityId}`;
            } else if (isOptimusProd) {
                riskMitigationResultsUrl = `https://alexacertquantum-jlb-iad.iad.proxy.amazon.com/api/risk-mitigation/results/edit/OPTIMUS/certMngrId/${getCertMngrId()}/completed/${rowActivityId}`
            }
            GM_xmlhttpRequest({
                method: "POST",
                url: riskMitigationResultsUrl,
                //headers: {"Content-Type": "application/json"},
                onload: async function (response) {
                    console.log(response.responseText);
                }
            });

            let activityEditUrl;
            if (isOptimusPreprod) {
                activityEditUrl = `https://alexa-skills-sams-gamma-iad.iad.proxy.amazon.com/api/activityId/${rowActivityId}/edit`;
            } else if (isOptimusProd) {
                activityEditUrl = `https://alexa-skills-sams-jlb-iad.iad.proxy.amazon.com/api/activityId/${rowActivityId}/edit`;
            }
            GM_xmlhttpRequest({
                method: "POST",
                url: activityEditUrl,
                //headers: {"Content-Type": "application/json"},
                onload: async function (response) {
                    console.log(response.responseText);
                }
            });
            setTimeout(reloadPage, 2000);
        }
    }
    /*
     * ------------------------------------------------------------------------------------
     */

    /*
     * Activity Status - Adds a "Pass" or "Fail" status text to any completed activities.
     * Shows up in the status column added on to the "Completed" text.
     *
     * Also sets some of the information for 'localesJSON' for AFGTool, such as setting the shortHandLocale and
     * during the GM_xmlhttpRequest function call. Need to separate this out to run independently.**
     */
    async function runActivityStatus(rowActivity, rowActivityId, rowActivityLocale, rowActivityType) {
        let requiredFeedbackCounter = 1;
        let recommendedFeedbackCounter = 1;
        let localeDict = {
            'English (AU)' : 'en_AU',
            'English (CA)' : 'en_CA',
            'English (GB)' : 'en_GB',
            'English (IN)' : 'en_IN',
            'English (US)' : 'en_US',
            'French (CA)' : 'fr_CA',
            'French (FR)' : 'fr_FR',
            'German (DE)' : 'de_DE',
            'Hindi (IN)' : 'hi_IN',
            'Italian (IT)' : 'it_IT',
            'Japanese (JP)' : 'ja_JP',
            'Portuguese (BR)' : 'pt_BR',
            'Spanish (ES)' : 'es_ES',
            'Spanish (MX)' : 'es_MX',
            'Spanish (US)' : 'es_US'
        };

        if (rowActivity.children[1].textContent === 'Completed') {
            let shortHandLocale = localeDict[`${rowActivityLocale}`];
            if (rowActivityType !== 'Developer Communication') {
                localesJSON.locales[`${rowActivityLocale}`].shortHandLocale = shortHandLocale;
            }
            let completedActivityTestCases = [];
            let hasPassed = true;

            let sluRequiredIds = ["SLU_utterances_consistently", "SLU_correct_slots_context",
            "SLU_slot_sample_utterance", "SLU_Built_In_Phrase_Slot", "SLU_phrasing_Do_example",
            "SLU_initialisms_spelling_Invocation_Name_Managed", "SLU_Lexicon_Invocation_Name_Managed",
            "SLU_sample_scope_requests", "SLU_sample_intents_unique", "SLU_sample_language_written",
            "SLU_Elicitation_Unique_Slot", "SLU_Elicitation_Slot", "SLU_sample_schema_intent"];

            let completedTestCasesUrl;
            if (isOptimusPreprod) {
                completedTestCasesUrl = `https://alexacertquantum-gamma-iad.iad.proxy.amazon.com/api/risk-mitigation/results/query/skill/${getSkillId()}/version/${getSkillVersion()}/OPTIMUS/completed/certification?certMngrId=${getCertMngrId()}&locale=${shortHandLocale}&activityId=${rowActivityId}&includeAuditedActivity=undefined`;
            } else if (isOptimusProd) {
                completedTestCasesUrl = `https://alexacertquantum.aka.amazon.com/api/risk-mitigation/results/query/skill/${getSkillId()}/version/${getSkillVersion()}/OPTIMUS/completed/certification?certMngrId=${getCertMngrId()}&locale=${shortHandLocale}&activityId=${rowActivityId}&includeAuditedActivity=true`;
            }

            GM_xmlhttpRequest({
                method: "GET",
                headers: { "Content-Type": "application/json" },
                url: completedTestCasesUrl,
                onload: function (response) {
                    let activityRiskMitigationJSON = Array.from(JSON.parse(response.responseText));
                    activityRiskMitigationJSON.forEach(testCase => {
                        if (rowActivityType.toLowerCase() === 'functional' || rowActivityType.toLowerCase() === 'functionalduplicate'|| rowActivityType.toLowerCase() === 'security' || rowActivityType.toLowerCase() === 'securityduplicate') {
                            if (testCase.result === 'No') {
                                hasPassed = false;
                                localesJSON.locales[`${rowActivityLocale}`][`${rowActivityType}`].passed = hasPassed;
                                if (!isNullOrWhitespace(testCase.developerFeedback)) {
                                    if (!localesJSON.locales[`${rowActivityLocale}`][`${rowActivityType}`].requiredFeedback.includes(testCase.developerFeedback)) {
                                        localesJSON.locales[`${rowActivityLocale}`][`${rowActivityType}`].requiredFeedback += `${requiredFeedbackCounter}. ${testCase.developerFeedback}<br /><br />`;
                                    }
                                    requiredFeedbackCounter++;
                                }
                            }
                        } else if (rowActivityType.toLowerCase() === 'slu' || rowActivityType.toLowerCase() === 'sluduplicate'){
                            if (testCase.result === 'No' && sluRequiredIds.indexOf(testCase.riskId) > -1) {
                                hasPassed = false;
                                localesJSON.locales[`${rowActivityLocale}`][`${rowActivityType}`].passed = hasPassed;
                                if (!isNullOrWhitespace(testCase.developerFeedback)) {
                                    if (!localesJSON.locales[`${rowActivityLocale}`][`${rowActivityType}`].requiredFeedback.includes(testCase.developerFeedback)) {
                                        localesJSON.locales[`${rowActivityLocale}`][`${rowActivityType}`].requiredFeedback += `${requiredFeedbackCounter}. ${testCase.developerFeedback}<br /><br />`;
                                    }
                                    requiredFeedbackCounter++;
                                }
                            } else if (testCase.result === 'No') {
                                if (!isNullOrWhitespace(testCase.developerFeedback)) {
                                    localesJSON.locales[`${rowActivityLocale}`][`${rowActivityType}`].recommended = true;
                                    if (!localesJSON.locales[`${rowActivityLocale}`][`${rowActivityType}`].recommendedFeedback.includes(testCase.developerFeedback)) {
                                        localesJSON.locales[`${rowActivityLocale}`][`${rowActivityType}`].recommendedFeedback += `${recommendedFeedbackCounter}. ${testCase.developerFeedback}<br /><br />`;
                                    }
                                    recommendedFeedbackCounter++;
                                }
                            }
                        } else {
                            if (testCase.result === 'Yes' && !isNullOrWhitespace(testCase.developerFeedback)) {
                                hasPassed = false;
                                localesJSON.locales[`${rowActivityLocale}`][`${rowActivityType}`].passed = hasPassed;
                                if (!isNullOrWhitespace(testCase.developerFeedback)) {
                                    if (!localesJSON.locales[`${rowActivityLocale}`][`${rowActivityType}`].requiredFeedback.includes(testCase.developerFeedback)) {
                                        localesJSON.locales[`${rowActivityLocale}`][`${rowActivityType}`].requiredFeedback += `${requiredFeedbackCounter}. ${testCase.developerFeedback}<br /><br />`;
                                    }
                                    requiredFeedbackCounter++;
                                }
                            }
                        }
                        completedActivityTestCases.push(testCase);
                    });
                    if (hasPassed) {
                        if (rowActivity.children[0].textContent !== 'Developer Communication') {
                            rowActivity.children[1].textContent = 'Completed (PASS)';
                            rowActivity.children[1].style.color = "green";
                            localesJSON.locales[`${rowActivityLocale}`][`${rowActivityType}`].passed = hasPassed;
                        }
                    } else {
                        rowActivity.children[1].textContent = 'Completed (FAIL)';
                        rowActivity.children[1].style.color = "red";
                    }
                }
            })

        }
        return new Promise(resolve => setTimeout(resolve, 1000));
    }
    /*
     * -----------------------------------------------------------------------------------
     */

    /*
     * Blurb Copier - Adds a "Copy" button to any blurbs for failing test cases and once
     * clicked, copies text to the clipboard.Removes any html tags and reorganizes the
     * text for better readability.
     */
    function runBlurbCopier() {
        let pageObserver = new MutationObserver(() => {
            let contentTab = document.querySelector('.ant-tabs-content');
            if (contentTab !== null) {
                pageObserver.disconnect();
                let initialBlurbContainer = document.querySelector('.blurbArea');
                if (initialBlurbContainer !== null) {
                    createCopyBtn(initialBlurbContainer);
                }
                blurbObserver.observe(contentTab, {
                    attributes: true,
                    childList: true,
                    subtree: true
                });
            }
        });

        let blurbObserver = new MutationObserver(() => {
            let blurbContainer = document.querySelector('.blurbArea');
            if (blurbContainer !== null) {
                createCopyBtn(blurbContainer);
            }
        });

        pageObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        function createCopyBtn(blurbContainer) {
            let blurbCopyBtn = document.createElement('button');
            blurbCopyBtn.innerHTML = 'Copy';
            blurbCopyBtn.setAttribute('id', 'blurbCopyBtn');
            blurbCopyBtn.addEventListener('click', function() {
                let blurbText = document.querySelector('textarea').textContent;
                let strippedText = blurbText;
                navigator.clipboard.writeText(strippedText);
            });
            let copyBtn = document.getElementById('blurbCopyBtn');
            if (!blurbContainer.contains(copyBtn)) {
                blurbContainer.appendChild(blurbCopyBtn);
            }
        }
    }
    /*
     * -----------------------------------------------------------------------------------
     */

    /*
     * Optimus Widget Button - Adds an "Optimus" button to the existing Certified Widgets script
     * that takes you directly to the skill's Optimus page.
     */
    function runOptimusWidgetButton() {

        let cicSkillId;
        function setSkillId() {
            if (isCICProd || isCICPreprod) {
                cicSkillId = document.getElementById("appExternalId").innerHTML;
                // Strip spaces from skill ID string
                cicSkillId = cicSkillId.replace(/\s/g, '');
                cicSkillId = cicSkillId.replace(/<.+?>.+?<[/].+?>/g, '');
                GM_setValue('skillId', cicSkillId);
                let verify = GM_getValue('skillId', 'not assigned')
                } else {
                    cicSkillId = GM_getValue('skillId','');
                };
        };
        setSkillId();

        /*
         * --------------- Button Container DIV for ALL BUTTONS ---------------
        */

        var positionDivNode = document.createElement('DIV');
        var fdivNode = document.createElement("DIV");
        var ftitleNode = document.createElement("DIV");
        var ftextNode = document.createTextNode("Managed Cert Buttons");
        var helpLinkNode = document.createElement('A');
        var helpIconNode = document.createElement('IMG');
        var bdivNode = document.createElement("DIV");

        positionDivNode.style = "position: fixed; width: 100%; max-width: 1180px; height: 0px; margin: 0px auto; top: 40%; left: 50%; transform: translateX(-50%); border: 0px solid red;";

        fdivNode.id = "mgdCertTampermonkeyFooter";
        fdivNode.style = "position: absolute; right: 10px; width: 15%; max-width: 200px; min-width: 100px; min-height: 100px; background-color: #1e3d7b; text-align: center; font-variant: small-caps; padding: 5px; box-shadow: 2px 2px 5px black;";

        ftitleNode.style = "padding: 5px; margin-bottom: 5px; background-color: #2851a4; text-align: center; color: #d6e2f5;";

        helpLinkNode.id = 'mgdCertScriptHelp';
        helpLinkNode.title = 'Open README file for this script.'
        helpLinkNode.href = 'https://drive.corp.amazon.com/documents/Alexa%20Cetification%20Docs/Automation%20Script%20Library/CIC_mgd_cert_buttons_widget_README.txt';
        helpLinkNode.target = '_blank';
        helpLinkNode.style.marginLeft = '5px';

        helpIconNode.src = 'https://wiki.labcollab.net/confluence/s/en_GB/7402/131c587a84e4ee088cb3d1cec7ecd765481c9c79/6.4.3/_/images/icons/emoticons/help_16.png';
        helpIconNode.style.width = '12px';

        bdivNode.id = "tampermonkeyButtons";

        fdivNode.appendChild(ftitleNode);
        ftitleNode.appendChild(ftextNode);
        helpLinkNode.appendChild(helpIconNode);
        ftitleNode.appendChild(helpLinkNode);
        fdivNode.appendChild(bdivNode);
        positionDivNode.appendChild(fdivNode);

        if (isCICProd || isCICPreprod) { document.body.appendChild(positionDivNode); }

        /*-------------------------------------------------------------------------*/

        /*
         * --------------- Optimus Button ---------------
        */
        let bttnContainer = document.querySelector('#tampermonkeyButtons');
        let btnNodeOptimus = document.createElement("BUTTON");
        let btnTextOptimus = document.createTextNode("Optimus");
        btnNodeOptimus.style.margin = "10px";
        btnNodeOptimus.style.display = "inline";
        btnNodeOptimus.id = "optimusBtn";
        btnNodeOptimus.className = "button";
        btnNodeOptimus.appendChild(btnTextOptimus);
        btnNodeOptimus.addEventListener("click", async function() {

            let quantumUrl;
            if (isCICPreprod) {
                quantumUrl = `https://alexacertquantum-gamma-iad.iad.proxy.amazon.com/api/cert/results/skill/${cicSkillId}`;
            } else if (isCICProd) {
                quantumUrl = `https://alexacertquantum.aka.amazon.com/api/cert/results/skill/${cicSkillId}`;
            }

            $.getJSON(quantumUrl, function(data) {
                let versionArray = [];
                for (let i = 0; i < data.skillCertResults.length; i++) {
                    versionArray.push(data.skillCertResults[i].skillVersion);
                }

                let version = Math.max(...versionArray);
                let index = data.skillCertResults.findIndex(v => parseInt(v.skillVersion, 10) === version);

                if (typeof data.skillCertResults !== 'undefined') {
                    if (data.skillCertResults[index].skillStageCertMngrMap === null) {
                        alert("This skill does not have an Optimus workflow yet. Please continue using CIC for workflows.");
                    }
                    else {
                        let skillCertMngrId = data.skillCertResults[index].skillStageCertMngrMap.certification;

                        let optimusUrl;
                        if (isCICPreprod) {
                            optimusUrl = `https://optimus-preprod.aka.amazon.com/activityList/skill/${cicSkillId}/version/${version}/?certMngrId=${skillCertMngrId}`;
                        } else if (isCICProd) {
                            optimusUrl = `https://optimus-prod.aka.amazon.com/activityList/skill/${cicSkillId}/version/${version}/?certMngrId=${skillCertMngrId}`;
                        }

                        window.open(optimusUrl);
                    }
                }
            });
        });

        if (bttnContainer) {
            btnNodeOptimus.style.margin = '3px';
            btnNodeOptimus.style.whiteSpace = 'nowrap';
            bttnContainer.appendChild(btnNodeOptimus);
            bttnContainer.appendChild(document.createElement('DIV'));
        }

        /*-------------------------------------------------------------------------*/

        /*
         * --------------- Copy Skill ID Button ---------------
        */

        var copyTextArea = document.createElement("TEXTAREA");
        copyTextArea.id = 'copySIDTextArea'
        copyTextArea.style = 'position: fixed; bottom: -50%';
        copyTextArea.innerHTML = cicSkillId;
        document.body.appendChild(copyTextArea);

        var btnNodeCopySID = document.createElement("BUTTON");
        var btnTextCopySID = document.createTextNode("Copy");
        btnNodeCopySID.id = "copySIDBtn";
        btnNodeCopySID.className = "button";
        btnNodeCopySID.appendChild(btnTextCopySID);
        btnNodeCopySID.addEventListener("click", function () {
            document.getElementById('copySIDTextArea').select();
            document.execCommand("copy");
            //var copyBtn = document.getElementById("copySIDBtn")
            //copyBtn.innerHTML = "<i>Copied!</i>";
            document.getElementById("copySIDBtn").innerHTML = "<i>Copied!</i>";
            window.setTimeout(function(){document.getElementById("copySIDBtn").innerHTML = "Copy"}, 5000);
        });
        btnNodeCopySID.style.margin = "0px 2px 0px 0px";
        btnNodeCopySID.style.userSelect = "none";
        btnNodeCopySID.style.cssFloat = "right";
        if (isCICPreprod || isCICProd) {document.getElementById("appExternalId").parentElement.previousElementSibling.appendChild(btnNodeCopySID)};

        /*-------------------------------------------------------------------------*/

        /*
         * --------------- Enable Button ---------------
        */

        var btnNodeEnable = document.createElement("BUTTON");
        var btnTextEnable = document.createTextNode("Enable");
        btnNodeEnable.id = "enableBtn";
        btnNodeEnable.className = "button";
        btnNodeEnable.appendChild(btnTextEnable);
        btnNodeEnable.addEventListener("click", async function() {
            //navigator.clipboard.writeText(skillId);
            //GM_setValue('skillId', skillId);
            //window.setTimeout(function(){window.open('https://ask-skill-enabler.amazon.com')}, 500);
            setSkillId();
            window.open('https://ask-skill-enabler.amazon.com');
        });
        btnNodeEnable.style.margin = "3px";
        if (isCICPreprod || isCICProd) {
            document.getElementById("tampermonkeyButtons").appendChild(btnNodeEnable);
            document.getElementById("tampermonkeyButtons").appendChild(document.createElement('DIV'));
        };

        if (isSkillEnabler) {
            console.log('skillId is set to ', cicSkillId);
            var appIdInput = document.getElementsByName("applicationId")[0];
            var textToPaste = cicSkillId;
            window.setTimeout(function () {
                console.log('CIC ENABLE button script: auto-paste function started');
                appIdInput.focus();
                appIdInput.value = GM_getValue('skillId','');
                console.log('CIC ENABLE button script: auto-paste cursor focus complete');
                appIdInput.value = textToPaste;
                console.log('CIC ENABLE button script: auto-paste value set complete using ', textToPaste);
            }, 0);

            // Declare variable for each skill stage.
            var devStage = document.getElementById("stageDrdn").firstElementChild;
            var certStage = devStage.nextElementSibling;
            var liveStage = document.getElementById("stageDrdn").lastElementChild;
            // Set default skill stage.
            certStage.selected = true;

            return;
        }

        /*-------------------------------------------------------------------------*/

        /*
         * --------------- JIRA Button ---------------
        */

        function setSearchURLJira() {
            // (COMMENTED OUT FOR REFERENCE)
            /*
            // this searches all of JIRA
            var url = "https://issues.labcollab.net/secure/QuickSearch.jspa?searchString=";
            var urlSuffix = "";
            */
            /*
            // this searches ASKSA and ALLSM projects for open tickets
            var url = "https://issues.labcollab.net/issues/?jql=project%20in%20(ASKSA%2C%20ALLSM)%20AND%20status%20in%20(Screen%2C%20%22In%20Progress%22%2C%20Reopened)%20AND%20text%20~%20%22";
            var urlSuffix = "%22";
            */
            // this searches ASKSA and ALLSM projects for open tickets... AND sorts results to show Epics, then cert Stories, and then LSM
            var url = "https://issues.labcollab.net/issues/?jql=((project%20%3D%20ASKSA%20AND%20issuetype%20in%20(Epic%2C%20Story))%20OR%20(project%20%3D%20ALLSM%20AND%20issuetype%20in%20(Bug%2C%20%22Feature%20Request%22%2C%20Story)))%20AND%20status%20in%20(Screen%2C%20%22In%20Progress%22%2C%20Reopened)%20AND%20text%20~%20%22";
            var urlSuffix = "%22%20ORDER%20BY%20project%20ASC%2C%20type%20ASC";
            //add skill ID to URL
            url = url.concat(cicSkillId);
            //add urlSuffix to URL
            url = url.concat(urlSuffix);
            //return command to open URL in new tab
            return "window.open('" + url + "')";
        };

        //create button node
        var btnNodeJira = document.createElement("BUTTON");
        //create node for button text
        var btnTextJira = document.createTextNode("JIRA");
        //variable to call URL function
        var searchUrlJira = setSearchURLJira();
        //assign ID to button node
        btnNodeJira.id = "jiraSearchBtn";
        //add CIC's built-in class for styling
        btnNodeJira.className = "button";
        //add text node to button node
        btnNodeJira.appendChild(btnTextJira);
        //add onclick functionality to button node
        btnNodeJira.setAttribute("onclick", searchUrlJira);
        //add side margins to button node
        btnNodeJira.style.margin = "3px";
        //add button to to table cell with id 'tampermonkeyButtons'
        if(isCICPreprod || isCICProd) {
            document.getElementById("tampermonkeyButtons").appendChild(btnNodeJira);
            document.getElementById("tampermonkeyButtons").appendChild(document.createElement('DIV'));
        };

        /*-------------------------------------------------------------------------*/

        /*
         * --------------- Salesforce Button ---------------
        */

        function setSearchURLSf() {
            var url = "https://alexabizops.my.salesforce.com/_ui/search/ui/UnifiedSearchResults?searchType=2&sen=a03&sen=005&str=";
            url = url.concat(cicSkillId);
            return "window.open('" + url + "')"
        };
        var btnNodeSf = document.createElement("BUTTON");
        var btnTextSf = document.createTextNode("Salesforce");
        var searchUrlSf = setSearchURLSf();
        btnNodeSf.id = "sfSearchBtn";
        btnNodeSf.className = "button";
        btnNodeSf.appendChild(btnTextSf);
        btnNodeSf.setAttribute("onclick", searchUrlSf);
        btnNodeSf.style.margin = "3px";
        if(isCICPreprod || isCICProd) {
            document.getElementById("tampermonkeyButtons").appendChild(btnNodeSf);
            document.getElementById("tampermonkeyButtons").appendChild(document.createElement('DIV'));
        };

        /*-------------------------------------------------------------------------*/
    }
    /*
     * -----------------------------------------------------------------------------------------
     */

    function runResultAllButtons() {
        /*
        * The below section adds the Not Tested button that affects a single category. It also adds a Fail button, which is commented out
        */

        window.addEventListener('load', async () => loadButtons(), false);
        window.addEventListener('click', async () => reloadButtons(), false);

        function reloadButtons()
        {
            let buttonCheck = document.getElementById("notTestedButtonSingle");
            if (buttonCheck === undefined || buttonCheck === null)
            {
                loadButtons();
            }
        }

        function pause(milliseconds) {
            return new Promise(resolve => setTimeout(resolve, milliseconds));
        }

        async function loadButtons()
        {
            let i = 0;
            do {
                i++;
                await pause(1000);
                await showButtons();
                if(i > 10) {break;}
            } while (i < 10 && document.getElementsByClassName("ant-col ant-col-12 optimus-text-right")[0] === undefined);
        }

        async function showButtons()
        {
            await setTimeout(document.getElementsByClassName("ant-col ant-col-12 optimus-text-right").onload = function() {
                let targLoc = document.getElementsByClassName("ant-col ant-col-12 optimus-text-right")[0];
                if(targLoc !== undefined) {
                    notTestedButtonSingle('NOT TESTED ALL', selectNotTestedButtonSingleFn);
                    //failButtonSingle('FAIL ALL', selectFailButtonSingleFn);
                }
            }, 1000);
        }

        function notTestedButtonSingle(text, onclick) {
            let cssObj = {border: 'none', color: 'white', position: 'absolute', right:'65.5%', 'z-index': 3};
            let button = document.createElement('button'), btnStyle = button.style;
            let buttonClass = document.getElementsByClassName("ant-col ant-col-12 optimus-text-right");
            buttonClass[0].appendChild(button);
            button.innerHTML = `<span role="button" class="roundedButton-wrapper" id="notTestedButtonSingle" tabindex="0"><i aria-label="icon: check" class="anticon anticon-check roundedButton-icon" style="color: rgb(204, 204, 204);"><svg viewBox="64 64 896 896" class="" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path></svg></i><span>${text}</span></span>`;
            button.onclick = onclick;
            Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
        }

        function failButtonSingle(text, onclick) {
            let cssObj = { border: 'none', color: 'white', position: 'absolute', right:'96.5%', 'z-index': 3 };
            let button = document.createElement('button'), btnStyle = button.style;
            let buttonClass = document.getElementsByClassName("ant-col ant-col-12 optimus-text-right");
            buttonClass[0].appendChild(button);
            button.innerHTML = `<span role="button" class="roundedButton-wrapper" id="failButtonSingle" tabindex="0"><i aria-label="icon: open circle" class="anticon anticon-check roundedButton-icon" style="color: rgb(204, 204, 204);"><svg viewBox="64 64 896 896" class="" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"></svg></i><span>${text}</span></span>`;
            button.onclick = onclick;
            Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
        }

        function selectNotTestedButtonSingleFn() {
            selectButtonBySpanSingle("Not Tested");
        }

        function selectFailButtonSingleFn() {
            selectButtonBySpanSingle("Fail");
        }

        function selectButtonBySpanSingle(spanVal) {
            let devices = document.getElementsByClassName("ant-radio-button-wrapper");
            const activityType = document.querySelectorAll('.p-lg')[2].textContent;
            let supported = false;

            //This switch statement makes adjustments for CX and Policy
            switch (activityType)
            {
                case "CX Tests":
                    if (spanVal === "Pass"||spanVal === "Not Tested") {
                        spanVal = "No";
                        supported = true;
                    }
                    break;
                case "Content Policy Tests":
                    supported = false;
                    break;
                default:
                    supported = true;
            }

            //If the button is supported on this page, it will select the appropriate options. If not, an alert box will trigger.
            if(supported)
            {
                //This for loop iterates through the buttons and clicks on any matching spanVal based on the span tag
                let buttonData = document.querySelectorAll(".ant-list-item-extra button");
                for (let h = 0; h < buttonData.length; h++)
                {
                    if (buttonData[h].getElementsByTagName("span")[0].innerHTML === spanVal)
                    {
                        buttonData[h].click();
                    }
                }
            } else {
                //If there isn't a good way to support the button, an alert box informs the user.
                alert("The " + spanVal + " button is not supported for " + activityType);
            }
        }

        /*
        * End of Not Tested by category button.
        */


        /*
        * The below section contains the Pass All, Clear All, Fail All, and Not Tested All buttons features and logic.
        * These buttons iterate through the skill and select all available buttons results of the appropriate type for each device type
        */

        //This statement adds the Pass All, Clear All, Fail All, and Not Tested All buttons if on the Production Optimus Activity Detail page

        window.addEventListener('load', () => {
            passButton('Pass All', selectPassButtonFn)
            clearButton('Clear All', selectClearButtonFn)
            failButton('Fail All', selectFailButtonFn)
            notTestedButton('Not Tested All', selectNotTestedButtonFn)
            copyPolicy('Copy Policy', selectCopyPolicyButtonFn)
        })

        //These functions define the buttons and the functions that they trigger when clicked.
        function passButton(text, onclick) {
            let cssObj = {position: 'absolute', top: '2%', right:'18%', 'z-index': 3}
            let button = document.createElement('button'), btnStyle = button.style
            document.body.appendChild(button)
            button.innerHTML = text
            button.onclick = onclick
            Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]})
        }

        function clearButton(text, onclick) {
            let cssObj = {position: 'absolute', top: '2%', right:'11%', 'z-index': 3}
            let button = document.createElement('button'), btnStyle = button.style
            document.body.appendChild(button)
            button.innerHTML = text
            button.onclick = onclick
            Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]})
        }

        function failButton(text, onclick) {
            let cssObj = {position: 'absolute', top: '2%', right:'24.65%', 'z-index': 3}
            let button = document.createElement('button'), btnStyle = button.style
            document.body.appendChild(button)
            button.innerHTML = text
            button.onclick = onclick
            Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]})
        }

        function notTestedButton(text, onclick) {
            let cssObj = {position: 'absolute', top: '2%', right:'31%', 'z-index': 3};
            let button = document.createElement('button'), btnStyle = button.style;
            document.body.appendChild(button);
            button.innerHTML = text;
            button.onclick = onclick;
            Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
        }

        function copyPolicy(text, onclick) {
            let cssObj = {position: 'absolute', top: '2%', right:'40.65%', 'z-index': 3};
            let button = document.createElement('button'), btnStyle = button.style;
            document.body.appendChild(button);
            button.innerHTML = text;
            button.onclick = onclick;
            Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
        }

        function selectClearButtonFn(){
            var devices = document.getElementsByClassName("ant-radio-button-wrapper");
            for (var k = 0 ; k<devices.length; k++)
            {
                devices[k].click();
                var categories = document.querySelectorAll(".riskCategories li");

                for (var i = 0; i<categories.length; i++) {
                    console.log(categories.length,categories[i]);
                    if (categories[i]){
                        categories[i].click();
                        document
                            .getElementsByClassName(
                            "anticon roundedButton-icon"
                        )[1]
                            .click();
                    }
                }
            }
        }

        function selectPassButtonFn() {
            selectButtonBySpan("Pass");
        }

        function selectFailButtonFn() {
            selectButtonBySpan("Fail");
        }

        function selectNotTestedButtonFn() {
            selectButtonBySpan("Not Tested");
        }

        function selectCopyPolicyButtonFn() {
            selectButtonBySpan("Copy Policy");
        }

        //This function selects the appropriate option based on the value of the span for the selection.
        function selectButtonBySpan(spanVal) {
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
                    supported = false;
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
                   copyPolicyBlurb(devices);
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
                for (let k = 0 ; k < devices.length; k++)
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
                                if (buttonData[h].getElementsByTagName("span")[0].innerHTML === spanVal)
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



        /*
        * End of Pass All, Clear All, Fail All, and Not Tested All buttons functionality.
        */
    }

    function runAfgTool() {
        let jiraStoryKey;

        GM_addStyle(`
            .afg-modal-bg {
                height: 100%;
                background-color: rgba(0, 0, 0, 0.65);
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 1000;
                display: none;
                justify-content: center;
                align-items: center;
            }

            .afg-modal-content {
                width: 50%;
                height: 90%;
                overflow-y: auto;
                overflow-x: hidden;
                background-color: white;
                border-radius: 4px;
                text-align: center;
                padding: 20px;
                position: relative;
            }

            .afg-rda-close {
                position: absolute;
                top: 0;
                right: 14px;
                font-size: 36px;
                transform: rotate(45deg);
                cursor: pointer;
            }

        `);

        $('body').append(`
            <div class="afg-modal-bg">
                <div id='afg-modal-container' class="afg-modal-content">
                <div class="afg-rda-close">+</div>
                    <br>
                    <div class='temp-rda-container' style='display: none;'>
                        <div class='word-wrapper' id='temp-rda-info'>
                        </div>
                    </div>
                    <div class="googoose-wrapper">
                        <div class='googoose header' align='right'>
                            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_Alexa_logo.svg/320px-Amazon_Alexa_logo.svg.png' width='160' height='23' style='display: none;'>
                        </div>
                        <div id='afg-feedback-content'>
                            <p id='afg-rda-skillTitle' style='font-family: "Calibri Light"; font-size: 28pt; font-weight: normal;'></p>
                            <p class='afg-skillId' style='font-family: "Calibri"; font-size: 11pt; font-weight: normal;' id='afg-rda-skillId'></p><br /><br />
                            <div id='afg-certSummary-container'>
                                <p id='afg-rda-certSummaryTitle' style='color: rgb(46,116,181); font-family: "Calibri"; font-size: 16pt; font-weight: normal;' >CERTIFICATION SUMMARY</p>
                            </div>
                            <div><br /><br /></div>
                        </div>
                        <div style='display: none;'>
                            <div class='googoose footer' align='center'>
                                <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_Alexa_logo.svg/320px-Amazon_Alexa_logo.svg.png' width='106' height='15'>
                                <p style='font-family: "Calibri"; font-size: 7pt; font-weight: normal;'><span>&copy;</span>2020 Amazon.com or its affiliates. All rights reserved. Amazon, Alexa, Echo, Echo Show, Echo Dot, and all related logos and motion marks are trademarks of Amazon.com, Inc. or its affiliates. 410 Terry Avenue North, Seattle, WA 98109.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);

        if (isOptimusActivityOverview) {
            showRdaLink();
            createExportButton();
        }

        function createRdaLink(skillDetailsLink) {
            let linkContainer = document.querySelector('.skillInfo.p-lg div div div:nth-child(3) div.ant-col.ant-col-16 div:nth-child(1)');
            let rdaLinkNode = skillDetailsLink.cloneNode(true);
            afgModalElement = document.querySelector('.afg-modal-bg');

            rdaLinkNode.childNodes[0].childNodes[0].textContent = 'Skill Feedback';
            rdaLinkNode.removeAttribute('href');
            rdaLinkNode.setAttribute('id', 'afg-rda-button');

            rdaLinkNode.addEventListener('click', () => {
                afgModalElement.style.display = 'flex';
            })

            linkContainer.appendChild(rdaLinkNode);
            createRdaWindow();
        }

        function showRdaLink() {
            let skillDetailsLink = document.querySelector('.skillInfo-externalLinks.m-l-lg');

            if (skillDetailsLink !== 'undefined' && skillDetailsLink !== null && document.querySelectorAll('.ant-table-row').length > 0) {
                statusObserver.disconnect();
                createRdaLink(skillDetailsLink);
            }
        }

        function createRdaWindow() {
            console.log(localesJSON)
            const afgWindowTitle = document.querySelector('#afg-rda-skillTitle');
            const afgWindowSkillId = document.querySelector('#afg-rda-skillId');

            let today = new Date();
            let date = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
            afgWindowTitle.textContent = skillName;
            afgWindowSkillId.innerHTML = skillId + '<br><br>' + date;


            let rdaFeedbackContainer = document.querySelector('#afg-feedback-content');
            let languageFeedback = {};

            // Loop through each locale
            for (const [key, value] of Object.entries(localesJSON.locales)) {
                let localePasses = ``;
                let recommendedFeedback = '';
                let requiredFeedback = '';
                let jiraCommentHeaders = '';
                let localeKey = key;
                let hasRecommendations;
                let shortHand = value.shortHandLocale;
                if (!(`${/(..*) \(/g.exec(localeKey)[1]}` in languageFeedback)) {
                    languageFeedback[`${/(..*) \(/g.exec(localeKey)[1]}`] = {'passed' : ``};
                }
                // Loop through each activity type within the locale
                for (const [key, value] of Object.entries(localesJSON.locales[`${localeKey}`])) {
                    if (key !== 'shortHandLocale') {
                        let activityResults = value;
                        let activityType = key;
                        if (activityResults.passed === false) {
                            languageFeedback[`${/(..*) \(/g.exec(localeKey)[1]}`].passed = false;
                            if (activityResults.recommended === true) {
                                languageFeedback[`${/(..*) \(/g.exec(localeKey)[1]}`] = {'recommended' : true};
                                hasRecommendations = true;
                                recommendedFeedback += `(${activityType})<br><br>`;
                                recommendedFeedback += activityResults.recommendedFeedback;
                            }
                            activityResults.jiraCommentHeader = shortHand + '_' + activityType + '_FAILED\n';
                            if (activityType !== 'CX') {
                                jiraCommentHeaders += activityResults.jiraCommentHeader;
                            }
                            requiredFeedback += `(${activityType})<br><br>`;
                            requiredFeedback += activityResults.requiredFeedback;
                            localePasses = false;
                        } else if (activityResults.passed === true) {
                            localePasses = true;
                            if (languageFeedback[`${/(..*) \(/g.exec(localeKey)[1]}`].passed !== false) {
                                languageFeedback[`${/(..*) \(/g.exec(localeKey)[1]}`].passed = true;
                            }
                            if (!isNullOrWhitespace(activityResults.recommendedFeedback)) {
                                hasRecommendations = true;
                                recommendedFeedback += `(${activityType})<br><br>`;
                                recommendedFeedback += activityResults.recommendedFeedback;
                            }
                            activityResults.jiraCommentHeader = shortHand + '_' + activityType + '_PASSED\n';
                            if (activityType !== 'CX' && activityType !== 'Content Policy') {
                                jiraCommentHeaders += activityResults.jiraCommentHeader;
                            }
                        }
                    }
                }
                if ((localePasses === true && hasRecommendations === true) || localePasses === false) {
                    let localeFeedbackNode = createLocaleFeedbackNode(localeKey, jiraCommentHeaders, recommendedFeedback, requiredFeedback, hasRecommendations);
                    rdaFeedbackContainer.appendChild(localeFeedbackNode);
                } else if (localePasses === true && !isNullOrWhitespace(jiraCommentHeaders)) {
                    let localeFeedbackNode = createLocaleFeedbackNode(localeKey, jiraCommentHeaders, recommendedFeedback, requiredFeedback, hasRecommendations);
                    rdaFeedbackContainer.appendChild(localeFeedbackNode);
                }
            }
            setTimeout(() => {
                console.log(languageFeedback);
                createCertSummaryNode(languageFeedback);
            }, 1000);
            document.querySelector('.afg-rda-close').addEventListener('click', () => {
                afgModalElement.style.display = 'none';
            })

            window.onclick = (event) => {
                if (event.target === afgModalElement) {
                    afgModalElement.style.display = 'none';
                }
            }
        }

        function createCertSummaryNode(languageFeedback) {
            let certSummaryContainer = document.querySelector('#afg-certSummary-container');
            for (const [key, value] of Object.entries(languageFeedback)) {
                let certSummaryNodeTitle = document.createElement('h1');
                certSummaryNodeTitle.className = 'afg-certSummaryText';
                certSummaryNodeTitle.style.fontFamily = 'Calibri Light';
                certSummaryNodeTitle.style.fontSize = '13pt';
                certSummaryNodeTitle.style.fontWeight = 'normal';
                let language = key;
                let results = value;
                if (results.passed === false && results.recommended === true) {
                    certSummaryNodeTitle.innerHTML = `${language} - FAILED w/ Recommendations`;
                    certSummaryContainer.appendChild(certSummaryNodeTitle);
                } else if (results.passed === false) {
                    certSummaryNodeTitle.innerHTML = `${language} - FAILED`;
                    certSummaryContainer.appendChild(certSummaryNodeTitle);
                } else if (results.passed === true && results.recommended === true) {
                    certSummaryNodeTitle.innerHTML = `${language} - PASSED w/ Recommendations`;
                    certSummaryContainer.appendChild(certSummaryNodeTitle);
                } else if (results.passed === true) {
                    certSummaryNodeTitle.innerHTML = `${language} - PASSED`;
                    certSummaryContainer.appendChild(certSummaryNodeTitle);
                }
            }
        }

        function createLocaleFeedbackNode(locale, jiraCommentHeaders, recommendedFeedback, requiredFeedback, hasRecommendations) {
            let formattedRecommendedFeedback = '';
            let formattedRequiredFeedback = '';
            let localeDiv = document.createElement('div');
            let localeRecommendedFeedbackList = document.createElement('p');
            let localeRequiredFeedbackList = document.createElement('p');
            let localeTitle = document.createElement('h3');
            let localeFeedback = document.createElement('p');
            let localeJiraHeaders = document.createElement('p');
            let recommendedFeedbackSplitString = recommendedFeedback.split('\n');
            let requiredFeedbackSplitString = requiredFeedback.split('\n');

            localeFeedback.style.fontFamily = 'Calibri';
            localeFeedback.style.fontSize = '11pt';
            localeFeedback.style.fontWeight = 'normal';

            localeJiraHeaders.style.fontFamily = 'Calibri';
            localeJiraHeaders.style.fontSize = '11pt';
            localeJiraHeaders.style.fontWeight = 'normal';

            localeRecommendedFeedbackList.style.fontFamily = 'Calibri';
            localeRecommendedFeedbackList.style.fontSize = '11pt';
            localeRecommendedFeedbackList.style.fontWeight = 'normal';

            localeRequiredFeedbackList.style.fontFamily = 'Calibri';
            localeRequiredFeedbackList.style.fontSize = '11pt';
            localeRequiredFeedbackList.style.fontWeight = 'normal';

            localeTitle.innerHTML = `${locale}<br /><br />`;
            localeTitle.className = 'afg-localeFeedbackTitle';
            localeTitle.style.fontFamily = 'Calibri';
            localeTitle.style.fontSize = '14pt';
            localeTitle.style.fontWeight = 'normal';
            localeTitle.style.color = 'rgb(46,116,181)';

            recommendedFeedbackSplitString.forEach(string => {
                formattedRecommendedFeedback += string + '<br />';
            });
            requiredFeedbackSplitString.forEach(string => {
                formattedRequiredFeedback += string + '<br />';
            });

            if (!isNullOrWhitespace(requiredFeedback) && !localeFeedback.innerHTML.toLowerCase().includes('required:')) {
                localeFeedback.innerHTML += '<p style="font-family: Calibri; font-size: 11pt; font-weight: normal;">Required: <br /><br /></p>';
            }
            if (!isNullOrWhitespace(requiredFeedback)) {
                localeRequiredFeedbackList.innerHTML += formattedRequiredFeedback;
                localeFeedback.appendChild(localeRequiredFeedbackList);
            }

            if (hasRecommendations === true) {
                if (!localeFeedback.innerHTML.toLowerCase().includes('recommended:')) {
                    localeFeedback.innerHTML += '<p style="font-family: Calibri; font-size: 11pt; font-weight: normal;">Recommended: <br /><br /></p>';
                }
                localeRecommendedFeedbackList.innerHTML += formattedRecommendedFeedback;
                localeFeedback.appendChild(localeRecommendedFeedbackList);
            }

            localeJiraHeaders.innerHTML += jiraCommentHeaders.replace(/\n/g, '<br/>');
            let postToJiraButton = createPostToJiraButton(jiraCommentHeaders, localeFeedback.innerHTML);

            localeDiv.appendChild(localeTitle);
            localeDiv.appendChild(localeJiraHeaders);
            localeDiv.appendChild(localeFeedback);
            localeDiv.appendChild(postToJiraButton);

            return localeDiv;
        }

        function createPostToJiraButton(jiraCommentHeaders, localeFeedback) {
            if (localeFeedback !== undefined) {
                localeFeedback = removeHTMLCode(localeFeedback);
            }
            let feedback = jiraCommentHeaders + '\n\n\n' + localeFeedback;
            let buttonNode = document.createElement('a');
            let buttonText = document.createTextNode('Post Feedback to JIRA');
            buttonNode.appendChild(buttonText);
            buttonNode.classList.add('ant-btn');
            buttonNode.setAttribute('id', 'postJiraButton');
            buttonNode.addEventListener('click', () => {
                postToJira(feedback);
            });
            buttonNode.style.marginBottom = '25px';
            return buttonNode;
        }

        function createExportButton() {
            let buttonContainer = document.querySelector('.afg-modal-content');
            let buttonNode = document.createElement('a');
            let buttonText = document.createTextNode('Generate RDA Doc');

            buttonNode.appendChild(buttonText);
            buttonNode.classList.add('ant-btn');
            buttonNode.setAttribute('id', 'generateRdaButtonAFG');
            buttonNode.addEventListener('click', exportHTML);

            buttonContainer.appendChild(buttonNode);
        }

        // Obtains the skill's current JIRA story key. It first searches JIRA by the skill's ID, only looking for the Epic for the skill (of which there is assumed to be only one).
        // Then, it searches for issues of type Story only within the Epic, grabbing the first result in descending order. The function assumes this is the most
        // current story for the skill. It then assigns and returns the key for that story.
        async function searchJira(skillId) {
            let epicKey;
            let searchForEpicURL = `https://issues.labcollab.net/rest/api/2/search?jql=project%20%3D%20ASKSA%20AND%20issuetype%20%3D%20Epic%20AND%20text%20~%20${skillId}`;
            GM_xmlhttpRequest({
                method: "GET",
                headers: {"Content-Type": "application/json"},
                url: searchForEpicURL,
                onload: function (response) {
                    let results = JSON.parse(response.responseText);
                    epicKey = results.issues[0].key;
                    let searchForStoryURL = `https://issues.labcollab.net/rest/api/2/search?jql=project%20%3D%20ASKSA%20AND%20issuetype%20%3D%20Story%20AND%20"Epic%20Link"%20%3D%20${epicKey}%20ORDER%20BY%20created%20DESC`;
                    console.log(epicKey);
                    GM_xmlhttpRequest({
                        method: "GET",
                        headers: {"Content-Type": "application/json"},
                        url: searchForStoryURL,
                        onload: function (response) {
                            let results = JSON.parse(response.responseText);
                            jiraStoryKey = results.issues[0].key;
                            console.log(jiraStoryKey);
                        }
                    });
                }
            });
            return new Promise(resolve => setTimeout(resolve, 2000));
        }

        async function postToJira(feedback) {
            await searchJira(skillId);
            let comment = {"body": `${feedback}`};
            GM_xmlhttpRequest({
                method: "POST",
                headers: { "Authorization": "Basic", "Content-Type": "application/json", "X-Atlassian-Token": "nocheck", "Origin": "https://issues.labcollab.net" },
                data: JSON.stringify(comment),
                url: `https://issues.labcollab.net/rest/api/2/issue/${jiraStoryKey}/comment`,
                onload: function (response) {
                    console.log(response.status);
                    if (response.status === 201) {
                        alert(`Comment posted successfully to ${jiraStoryKey}`);
                    } else if (response.status === 404) {
                        alert('Error in posting comment. Make sure you are logged in to JIRA before trying to post feedback.');
                    }
                }
            });
        }

        function removeHTMLCode(jiraBlurbText) {
            let stripTags = str => str.replace(/<p style="font-family: Calibri; font-size: 11pt; font-weight: normal;">|<\/p>/g, '').replace(/<br>/g, '\n').replace(/<a href="*/g, '').replace(/"> */g, ' ').replace(/<\/a*>/g, '');
            let linkTitles = /<a href=.*?https:\/\/.*?.*?>(.*?)<\/a>/g;
            let linkHrefs = /<a href="(.*?)">/g;
            let strippedText = stripTags(jiraBlurbText);
            let titleMatches = Array.from(jiraBlurbText.matchAll(linkTitles), m => m[1]);
            let hrefMatches = Array.from(jiraBlurbText.matchAll(linkHrefs), m => m[1]);

            for (let i = 0; i < titleMatches.length; i++) {
                strippedText = strippedText.replace(titleMatches[i], '');
            }

            for (let i = 0; i < hrefMatches.length; i++) {
                strippedText = strippedText.replace(hrefMatches[i], `[${titleMatches[i]}|${hrefMatches[i]}]`);
            }
            return strippedText;
        }

        function exportHTML() {
            let wordDocNode = document.querySelector('.googoose-wrapper').cloneNode(true);
            let rdaContainer = document.getElementById('temp-rda-info');
            let today = new Date();
            let date = (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear();
            wordDocNode.innerHTML = wordDocNode.innerHTML.replace(/<a class="ant-btn" id="postJiraButton" style="margin-bottom: 25px;">Post Feedback to JIRA<\/a>/g, '').replace(/’/g, "'");
            rdaContainer.appendChild(wordDocNode);
            let convertedFileParams = {
                area: 'div.word-wrapper',
                filename: `${skillName}_Feedback_${date}.doc`,
                headermargin: '.4in',
                footermargin: '.4in',
            };
            $(document).googoose(convertedFileParams);
        }
    }

    async function runPublishDateNotification() {
        let finalUrl;
        let startUrl = await getSkillDetailLink().then(function(result){return result;});

        GM_xmlhttpRequest({
            method: "GET",
            url: startUrl,
            onload: function(response) {
                finalUrl = response.finalUrl;
                getData(cicAddress(getActivityId(finalUrl)));
            }
        });
        //The Pause function is used in multiple locations to ensure that the elements have loaded.
        function pause(milliseconds) {
            return new Promise(resolve => setTimeout(resolve, milliseconds));
        }

        //This gets the initial URL from the SkillDetail link. The link is a redirect, so must be used elsewhere.
        async function getSkillDetailLink()
        {
            await pause(2000);
            let skillDetailLink = document.getElementsByClassName("skillInfo-externalLinks m-l-lg");
            return await Promise.resolve(skillDetailLink[0].href);
        }

        //This function extrats the date information from CIC after using the finalUrl data to identify the appropriate CIC page.
        function getData(finalUrl)
        {
            GM_xmlhttpRequest({
                method: "GET",
                url: finalUrl,
                headers: {
                    "User-Agent": "Mozilla/5.0"
                },
                responseType: "document",
                onload: function (response) {
                    let parser = new DOMParser();
                    let availabilityHtml = parser.parseFromString(response.responseText,"text/html");
                    let availabilityDate = availabilityHtml.getElementById("appAvailabilityDate").textContent.trim();
                    let stuff = document.getElementsByClassName("m-t-md")[0];
                    let notice = document.createElement ("div");
                    notice.innerHTML = "<div><p><b>This skill is set to be published on " + availabilityDate + "</b><br>Change publish date before RDA activity is generated if needed.<p></div>";
                    stuff.appendChild(notice);
                    notice.style.backgroundColor = 'blue';
                    notice.style.color = 'white';
                }
            });
        }

        //This function gets the activityId from the first CIC url, to use to access the correct CIC page
        function getActivityId(cicUrl)
        {
            const prefix = "https://skillcert.aka.amazon.com/application/";
            const suffix = "/detail.html?group=application";
            const startIndex = cicUrl.indexOf(prefix) + prefix.length;
            const endIndex = cicUrl.indexOf(suffix);
            const activityId = cicUrl.substring(startIndex, endIndex);
            return activityId;
        }

        //This takes the activityId and uses it to identify the Availability and Pricing page used to find the date.
        function cicAddress (activityId)
        {
            return 'https://skillcert.aka.amazon.com/application/'+activityId+'/pricing.html';
        }

    }

    function showSOPLink() {
        let currentActivityType;
        let sopLinkUrl;
        let labelArray = [];
        let elementObserver = new MutationObserver(() => {
            let contentTab = document.querySelector('.ant-tabs-content');
            if (contentTab !== null) {
                elementObserver.disconnect();
                let activityLabels = document.querySelectorAll('.customTags.m-sm');

                currentActivityType = (/(...*) Tests/g).exec(document.querySelector('h4.p-lg').textContent)[1];
                Array.from(activityLabels).forEach(element => {
                    labelArray.push(element.textContent);
                })
                switch (currentActivityType) {
                    case 'Functional':
                        if (labelArray.includes('CUSTOM')) {
                            sopLinkUrl = 'https://wiki.labcollab.net/confluence/display/ALEXACOPSMGD/Managed+Custom+Functional+SOP';
                        } else if (labelArray.includes('ISP')) {
                            sopLinkUrl = 'https://wiki.labcollab.net/confluence/display/ALEXACOPSMGD/ISP+SOP';
                        } else if (labelArray.includes('SMART HOME')) {
                            sopLinkUrl = 'https://wiki.labcollab.net/confluence/display/ALEXACOPSMGD/Smart+Home+Functional+SOP';
                        } else {
                            sopLinkUrl = 'https://wiki.labcollab.net/confluence/display/ALEXACOPSMGD/Functional+SOP';
                        }
                        createSopLink();
                        break;
                    case 'SLU':
                        sopLinkUrl = 'https://wiki.labcollab.net/confluence/display/ALEXACOPSMGD/SLU+Lite+SOP';
                        createSopLink();
                        break;
                    case 'Security':
                        sopLinkUrl = 'https://wiki.labcollab.net/confluence/display/ALEXACOPSMGD/Account+Linking+SOP';
                        createSopLink();
                    default:
                        break;
                }
                console.log(currentActivityType);
            }
        });

        function createSopLink() {
            let sampleLink = document.querySelector('.skillInfo-externalLinks.m-l-lg');
            let linkContainer = document.querySelector('.skillInfo.p-lg div div div:nth-child(3) div.ant-col.ant-col-16 div:nth-child(1)');
            let sopLinkNode = sampleLink.cloneNode(true);
            sopLinkNode.href = sopLinkUrl;

            if (currentActivityType === 'SLU') {
                sopLinkNode.childNodes[0].childNodes[0].textContent = `SLU SOP`;
            } else if (labelArray.includes('CUSTOM')) {
                sopLinkNode.childNodes[0].childNodes[0].textContent = `Custom SOP`;
            } else if (labelArray.includes('ISP')) {
                sopLinkNode.childNodes[0].childNodes[0].textContent = `ISP SOP`;
            } else if (labelArray.includes('SMART HOME')) {
                sopLinkNode.childNodes[0].childNodes[0].textContent = `Smart Home SOP`;
            } else {
                sopLinkNode.childNodes[0].childNodes[0].textContent = `Functional SOP`;
            }

            if (currentActivityType === 'Security') {
                sopLinkNode.childNodes[0].childNodes[0].textContent = `Account Linking SOP`;
            }

            sopLinkNode.setAttribute('id', 'sop-link-button');
            linkContainer.appendChild(sopLinkNode);
            if (currentActivityType === 'Functional' || currentActivityType === 'SLU' || currentActivityType === 'Security') {
                let precertSopNode = sampleLink.cloneNode(true);
                precertSopNode.childNodes[0].childNodes[0].textContent = `Pre-cert SOP`;
                precertSopNode.href = 'https://wiki.labcollab.net/confluence/display/ALEXACOPSMGD/Pre-Cert+SOP';
                linkContainer.appendChild(precertSopNode);
            }
        }

        elementObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // This creates the JSON that AFG Tool will use to generate the feedback window.
    function createActivitiesJSON(activityRows) {
        localesJSON.locales = {};

        activityRows.forEach(activity => {
            let activityType = activity.children[0].textContent;
            let activityLocale = activity.children[2].textContent;
            let activityId = activity.getAttribute('data-row-key');
            let activityData = {'activityId' : `${activityId}`, 'passed' : ``, 'recommended' : ``, 'recommendedFeedback' : ``, 'requiredFeedback' : ``};

            if (!JSON.stringify(localesJSON).includes(activityLocale)) {
                localesJSON.locales[`${activityLocale}`] = {};
            }

            if (activityType !== 'Developer Communication') {
                localesJSON.locales[`${activityLocale}`][`${activityType}`] = activityData;
            }

        });

    }

    function reloadPage() {
        document.location.reload(true);
    }

    function isNullOrWhitespace(input) {

        if (typeof input === 'undefined' || input === null) return true;

        return input.replace(/\s/g, '').length < 1;
    }

    function copyPolicyBlurb(devices) {

        var policyBlurb= "_POLICYTEST_<STATUS>\n";
        //Find rating of the skill
        var overallRating =  document.querySelectorAll('.p-lg')[2].querySelector('.customTags').textContent;
        policyBlurb = policyBlurb + "\nRating: " + overallRating;
        //Find counter exclusions
        var countryexclusion = document.querySelectorAll('.p-lg')[2].querySelectorAll('.ant-row-flex')[1].querySelectorAll('.ant-col')[1].textContent;
        policyBlurb = policyBlurb + "\nCountry Exclusions: " ;
        //Chcek if multiple country exclusions exist
        if (countryexclusion.includes("We didn’t find")){
        policyBlurb = policyBlurb + countryexclusion + "\n";
        }
        else{
            var countryExclusionArray = document.querySelectorAll('.p-lg')[2].querySelectorAll('.ant-row-flex')[1].querySelectorAll('.ant-col')[1].querySelectorAll('.customTags');
            for(let m = 0; m < countryExclusionArray.length;m++){
                if(m > 0){
                    policyBlurb =policyBlurb + ", "
                }
            policyBlurb = policyBlurb + countryExclusionArray[m].textContent;
            }
        }
        //Strat for loop
        // Removing the loop that chceks for all devices
        //for (let k = 0 ; k < devices.length; k++)

            devices[0].click();
            //policyBlurb = policyBlurb + "\n" + devices[k].textContent;
            const categories = document.querySelectorAll(".riskCategories li[class='ant-menu-item fail']");
            var polciySerialNo ='';
            var contentPolicyOverAll = '';
            //This for loop iterates through all testcases
            for (let i = 0; i < categories.length; i++)
            {
                if (categories[i]) {
                    categories[i].click();
                    //Find Failed policy testcases
                    const riskListView = document.querySelectorAll(".riskLists");
                    for (let j = 0; j < riskListView.length; j++){
                        //define header as ''
                        var policyHeader = '';
                        var contentPolicy = '';
                        const antListHeader = riskListView[j].querySelector(".ant-list-header div");
                        // Using sub string tockenizer find the header number
                        policyHeader = antListHeader.textContent.split(" ")[0];
                        contentPolicy = antListHeader.textContent.substring(policyHeader.length);
                        //Parse throgh all pass and fail buttons
                        const allPolicyButtons = riskListView[j].querySelectorAll(".answerButton");
                        //Keep and incrementer
                        for (let k = 0; k < allPolicyButtons.length; k++){
                            if(allPolicyButtons[k].textContent== 'Yes'){
                                //Add a counter, for k + 1
                                var counter = k + 1;
                                if(polciySerialNo.length > 0){
                                    polciySerialNo = polciySerialNo + "," + policyHeader +"."  + counter;
                                }
                                else{
                                    polciySerialNo = policyHeader +"."  + counter;
                                }
                                if(contentPolicyOverAll.length > 0){
                                    contentPolicyOverAll = contentPolicyOverAll +","  + contentPolicy;
                                }
                                else{
                                    contentPolicyOverAll =  contentPolicy;
                                }

                            }
                        }


                    }
                }
            }
            //Append other text for policy blurb

            //if no content policy marked
            if(contentPolicyOverAll.length == 0){
                policyBlurb = policyBlurb + "Content Policy: NA";
                policyBlurb = policyBlurb + "\nCP Test Cases: NA";
            }
            else{
                policyBlurb = policyBlurb + "Content Policy: " + contentPolicyOverAll;
            }
            if(polciySerialNo.length > 0){
                policyBlurb = policyBlurb + "\nCP Test Cases: " + polciySerialNo;
            }
            policyBlurb = policyBlurb + "\n"

        //End of main loop
        policyBlurb = policyBlurb + "EBPD:\n"+
        "Skill Content: [TC Number], <Capture evidence here>\n"+
        "Skill Metadata: [TC Number], <Capture evidence here>\n"+
        "Skill Badge: [TC Number], <Capture evidence here>\n"+
        "Other: [TC Number], <Capture evidence here>"
        GM_setClipboard(policyBlurb);
        alert("Copied");

    }
    /*
     * ----------------------------------------------------------------------------------------
     */

    /*
     * Managed Cert Buttons in Optimus
     * This provides buttons to navigate from optimus to the Skill specific JIRA , Salesforce or Skill Enabler page
     */
    function optimusCertButtons() {
        let optSkillId;
        //workflowAssignerText('Activity Assigner:');
        jiraButton('JIRA', navigateToJiraButtonFn);
        salesforceButton('Salesforce', navigateToSalesforceButtonFn);
        skillEnablerButton('Skill Enabler', navigateToSkillEnablerButtonFn);
        activitiesButton('Activity List', navigateToActivitiesButtonFn);

        function jiraButton(text, onclick) {
            let cssObj = {position: 'absolute', top: '1.5%', right:'10%', width: '4%', 'z-index': 3, 'font-size': '.58vw', padding: '0px'};
            let button = document.createElement('a'), btnStyle = button.style;
            button.classList.add('ant-btn');
            topBarElement = document.querySelector('.ant-row-flex');
            button.text = text;
            button.onclick = onclick;
            Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
            topBarElement.appendChild(button);
        }

        function salesforceButton(text, onclick) {
            let cssObj = {position: 'absolute', top: '1.5%', right:'14.5%', width: '4%', 'z-index': 3, 'font-size': '.58vw', padding: '0px'};
            let button = document.createElement('a'), btnStyle = button.style;
            button.classList.add('ant-btn');
            topBarElement = document.querySelector('.ant-row-flex');
            button.text = text;
            button.onclick = onclick;
            Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
            topBarElement.appendChild(button);
        }

        function skillEnablerButton(text, onclick) {
            let cssObj = {position: 'absolute', top: '1.5%', right:'19%', width: '4%', 'z-index': 3, 'font-size': '.58vw', padding: '0px'};
            let button = document.createElement('a'), btnStyle = button.style;
            button.classList.add('ant-btn');
            topBarElement = document.querySelector('.ant-row-flex');
            button.text = text;
            button.onclick = onclick;
            Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
            topBarElement.appendChild(button);
        }

        function activitiesButton(text, onclick) {
            let cssObj = {position: 'absolute', top: '1.5%', right:'23.5%', width: '4%', 'z-index': 3, 'font-size': '.58vw', padding: '0px'};
            let button = document.createElement('a'), btnStyle = button.style;
            button.classList.add('ant-btn');
            topBarElement = document.querySelector('.ant-row-flex');
            button.text = text;
            button.onclick = onclick;
            Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]});
            topBarElement.appendChild(button);
        }

        function navigateToJiraButtonFn() {
            setSkillId();
            var url = "https://issues.labcollab.net/issues/?jql=((project%20%3D%20ASKSA%20AND%20issuetype%20in%20(Epic%2C%20Story))%20OR%20(project%20%3D%20ALLSM%20AND%20issuetype%20in%20(Bug%2C%20%22Feature%20Request%22%2C%20Story)))%20AND%20status%20in%20(Screen%2C%20%22In%20Progress%22%2C%20Reopened)%20AND%20text%20~%20%22";
            var urlSuffix = "%22%20ORDER%20BY%20project%20ASC%2C%20type%20ASC";
            //add skill ID to URL
            url = url.concat(optSkillId);
            //add urlSuffix to URL
            url = url.concat(urlSuffix);
            //return command to open URL in new tab
            window.open(url);
        }

        function navigateToSalesforceButtonFn() {
            setSkillId();
            var url = "https://alexabizops.my.salesforce.com/_ui/search/ui/UnifiedSearchResults?searchType=2&sen=a03&sen=005&str=";
            url = url.concat(optSkillId);
            console.log(url);
            window.open(url);

        }

        function navigateToSkillEnablerButtonFn() {
            setSkillId();
            window.open('https://ask-skill-enabler.amazon.com');
        }

        function navigateToActivitiesButtonFn() {
            setSkillId();
            let quantumUrl;
            if (isOptimusSkillPreProd) {
                quantumUrl = `https://alexacertquantum-gamma-iad.iad.proxy.amazon.com/api/cert/results/skill/${optSkillId}`;
            } else if (isOptimusSkillProd) {
                quantumUrl = `https://alexacertquantum.aka.amazon.com/api/cert/results/skill/${optSkillId}`;
            }

            $.getJSON(quantumUrl, function(data) {
                let versionArray = [];
                for (let i = 0; i < data.skillCertResults.length; i++) {
                    versionArray.push(data.skillCertResults[i].skillVersion);
                }

                let version = Math.max(...versionArray);
                let index = data.skillCertResults.findIndex(v => parseInt(v.skillVersion, 10) === version);

                if (typeof data.skillCertResults !== 'undefined') {
                    if (data.skillCertResults[index].skillStageCertMngrMap === null) {
                        alert("This skill does not have an Optimus workflow yet. Please continue using CIC for workflows.");
                    }
                    else {
                        let skillCertMngrId = data.skillCertResults[index].skillStageCertMngrMap.certification;

                        let optimusUrl;
                        if (isOptimusSkillPreProd) {
                            optimusUrl = `https://optimus-preprod.aka.amazon.com/activityList/skill/${optSkillId}/version/${version}/?certMngrId=${skillCertMngrId}`;
                        } else if (isOptimusSkillProd) {
                            optimusUrl = `https://optimus-prod.aka.amazon.com/activityList/skill/${optSkillId}/version/${version}/?certMngrId=${skillCertMngrId}`;
                        }

                        window.open(optimusUrl);
                    }
                }
            });
        }

        function setSkillId() {
            optSkillId = document.getElementsByClassName("ant-typography skillIdInfo")[0].innerText;
            // Strip spaces from skill ID string
            optSkillId = optSkillId.replace(/\s/g, '');
            optSkillId = optSkillId.replace(/<.+?>.+?<[/].+?>/g, '');
            GM_setValue('skillId', optSkillId);
            let verify = GM_getValue('skillId', 'not assigned')
            optSkillId = GM_getValue('skillId','');
       };

    }

})();

