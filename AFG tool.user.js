// ==UserScript==
// @name         AFG Tool
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Script that automates RDA doc generation with the click of a button
// @author       juaortj
// @updateURL    https://drive.corp.amazon.com/view/Alexa%20Cetification%20Docs/Automation%20Script%20Library/AFG%20Tool.user.js
// @match        https://issues.labcollab.net/browse/*
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        none
// ==/UserScript==

(function() {
    var $ =window.jQuery;
    'use strict';

    var docxScript = document.createElement('script');
    var filesaverScript = document.createElement('script');
    var JQueryScript = document.createElement('script');
    var JQueryUiScript = document.createElement('script');
    docxScript.src = 'https://unpkg.com/docx@5.0.0-rc7/build/index.js';
    filesaverScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js';
    JQueryScript.src = 'https://code.jquery.com/jquery-1.11.1.min.js';
    JQueryUiScript.src = 'https://code.jquery.com/ui/1.11.1/jquery-ui.min.js';
    document.body.appendChild(docxScript);
    document.body.appendChild(filesaverScript);
    document.body.appendChild(JQueryUiScript);})();

var logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_Alexa_logo.svg/320px-Amazon_Alexa_logo.svg.png';
var convertedUrl = '';
toDataURL(logoUrl, function(dataUrl) {
    convertedUrl = dataUrl;
});

waitForKeyElements('#opsbar-opsbar-transitions', addButton);

function addButton() {
    var compileButton = createButton();
    compileButton.addEventListener('click', convertToXML);
    jQuery(compileButton).appendTo("[id='opsbar-opsbar-transitions']");
}

function createButton() {
    var buttonNode = document.createElement('a');
    var buttonText = document.createTextNode('Compile Feedback');
    buttonNode.appendChild(buttonText);
    buttonNode.classList.add('toolbar-trigger', 'issueaction-workflow-transition', 'aui-button');
    buttonNode.setAttribute('id', 'compileButton');
    return buttonNode;
}

function convertToXML() {
    var xmlUrl = new XMLHttpRequest();
    var jiraKey = document.getElementsByClassName('jira-wikifield')[0].getAttribute('issue-key');
    var targetUrl = `https://issues.labcollab.net/si/jira.issueviews:issue-xml/${jiraKey}/${jiraKey}.xml`;

    xmlUrl.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            verifyAndLoadLocales(this);
        }
    };
    xmlUrl.open('GET', targetUrl, true);
    xmlUrl.send(null);
}

function verifyAndLoadLocales(xmlForm) {
    var skillLocaleDetect = {
        de_de: false,
        en_all: false,
        es_es: false,
        es_mx: false,
        es_us: false,
        fr_ca: false,
        fr_fr: false,
        hi_in: false,
        it_it: false,
        ja_jp: false,
        pt_br: false,
        ar_sa: false
    }
    var locales = {
        English: ['en_us', 'en_ca', 'en_in', 'en_au', 'en_gb', '(en)', 'en_', 'au/', '/au', 'gb/', '/gb', 'uk/', '/uk'],
        Spanish: ['es_us', 'es_es', 'es_mx', '(es)', 'es_'],
        French: ['fr_ca', 'fr_fr', '(fr)', 'fr_'],
        Portuguese: ['pt_br', '(pt)', 'pt_'],
        German: ['de_de', 'de_', '(de)'],
        Japanese: ['ja_jp', '(jp)', 'ja_', 'jp_'],
        Italian: ['it_it', 'it_', '(it)'],
        Hindi: ['hi_in', '(hi)', 'hi_'],
        Arabic: ['ar_sa', '(ar)', 'ar_']
    }
    var feedback = {
        English: '',
        Spanish: '',
        French: '',
        Portuguese: '',
        German: '',
        Japanese: '',
        Italian: '',
        Hindi: '',
        Arabic: ''
    }
    var xmlDoc = xmlForm.responseXML;
    var commentsArray = Array.from(xmlDoc.getElementsByTagName('comment'));
    var labelsArray = Array.from(xmlDoc.getElementsByTagName('label'));
    var stripTags = str => str.replace(/<[^>]*>/g, '');

    commentsArray.forEach(element => {
        var localeComment = substring => element.textContent.toLowerCase().includes(substring);
        var cleanString = stripTags(element.textContent);

        if (element.getAttribute('author') !== 'bot-rosewood' && !element.textContent.includes('App ID &amp; Submission date')) {
            if(locales.English.some(localeComment)) {
                feedback.English += cleanString + '\r\n';
            }
            if(locales.Spanish.some(localeComment)) {
                feedback.Spanish += cleanString + '\r\n';
            }
            if(locales.French.some(localeComment)) {
                feedback.French += cleanString + '\r\n';
            }
            if(locales.Portuguese.some(localeComment)) {
                feedback.Portuguese += cleanString + '\r\n';
            }
            if(locales.German.some(localeComment)) {
                feedback.German += cleanString + '\r\n';
            }
            if(locales.Japanese.some(localeComment)) {
                feedback.Japanese += cleanString + '\r\n';
            }
            if(locales.Italian.some(localeComment)) {
                feedback.Italian += cleanString + '\r\n';
            }
            if(locales.Hindi.some(localeComment)) {
                feedback.Hindi += cleanString + '\r\n';
            }
            if(locales.Arabic.some(localeComment)) {
                feedback.Arabic += cleanString + '\r\n';
            }
        }
    });

    labelsArray.forEach(element => {
        var label = substring => element.textContent.toLowerCase().includes(substring);
        if (locales.English.some(label)) {
            skillLocaleDetect.en_all = true;
        }
        if (element.textContent.toLowerCase().includes('es_es')) {
            skillLocaleDetect.es_es = true;
        }
        if (element.textContent.toLowerCase().includes('es_mx')) {
            skillLocaleDetect.es_mx = true;
        }
        if (element.textContent.toLowerCase().includes('es_us')) {
            skillLocaleDetect.es_us = true;
        }
        if (element.textContent.toLowerCase().includes('fr_ca')) {
            skillLocaleDetect.fr_ca = true;
        }
        if (element.textContent.toLowerCase().includes('fr_fr')) {
            skillLocaleDetect.fr_fr = true;
        }
        if (element.textContent.toLowerCase().includes('pt_br')) {
            skillLocaleDetect.pt_br = true;
        }
        if (element.textContent.toLowerCase().includes('de_de')) {
            skillLocaleDetect.de_de = true;
        }
        if (element.textContent.toLowerCase().includes('ja_jp')) {
            skillLocaleDetect.ja_jp = true;
        }
        if (element.textContent.toLowerCase().includes('it_it')) {
            skillLocaleDetect.it_it = true;
        }
        if (element.textContent.toLowerCase().includes('hi_in')) {
            skillLocaleDetect.hi_in = true;
        }
        if (element.textContent.toLowerCase().includes('ar_sa')) {
            skillLocaleDetect.ar_sa = true;
        }
    });

    createDocument(feedback, skillLocaleDetect);
}

function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

function isNullOrWhitespace(input) {

    if (typeof input === 'undefined' || input == null) return true;

    return input.replace(/\s/g, '').length < 1;
}

function generateParagraph(feedback, locale, certResults, docRecFeedback) {
    let splitFeedbackString = feedback[locale].split('\n');
    if (feedback[locale].toLowerCase().includes('_failed') || feedback[locale].toLowerCase().includes('_fail')) {
        if (feedback[locale].toLowerCase().includes('recommended')) {
            if (locale == "Hindi") {
                docRecFeedback[locale] = new Paragraph({text: '', heading: HeadingLevel.HEADING_1});
            } else {
                docRecFeedback[locale] = new Paragraph('');
            }
            certResults[locale] = new TextRun({
                text: locale + ' ' + certResults.FailedWithRec,
            }).break();
            docRecFeedback[locale].addChildElement(new TextRun({
                text: '(' + locale + ')',
                font: 'Calibri Light',
                color: '2E74B5',
                size: '32',
            }).break().break())
            splitFeedbackString.forEach(string => {
                docRecFeedback[locale].addChildElement(new TextRun(string).break());
            });
        }
        else {
            if (locale == "Hindi") {
                docRecFeedback[locale] = new Paragraph({text: '', heading: HeadingLevel.HEADING_1});
            } else {
                docRecFeedback[locale] = new Paragraph('');
            }
            certResults[locale] = new TextRun({
                text: locale + ' ' + certResults.Failed,
            }).break();
            docRecFeedback[locale].addChildElement(new TextRun({
                text: '(' + locale + ')',
                font: 'Calibri Light',
                color: '2E74B5',
                size: '32',
            }).break().break())
            splitFeedbackString.forEach(string => {
                docRecFeedback[locale].addChildElement(new TextRun(string).break());
            });
        }
    }
    else {
        if (feedback[locale].toLowerCase().includes('recommended')) {
            if (locale == "Hindi") {
                docRecFeedback[locale] = new Paragraph({text: '', heading: HeadingLevel.HEADING_1});
            } else {
                docRecFeedback[locale] = new Paragraph('');
            }
            certResults[locale] = new TextRun({
                text: locale + ' ' + certResults.PassedWithRec,
            }).break();
            docRecFeedback[locale].addChildElement(new TextRun({
                text: '(' + locale + ')',
                font: 'Calibri Light',
                color: '2E74B5',
                size: '32',
            }).break().break())
            splitFeedbackString.forEach(string => {
                docRecFeedback[locale].addChildElement(new TextRun(string).break());
            });
        }
        else {
            certResults[locale] = new TextRun({
                text: locale + ' ' + certResults.Passed,
            }).break();
        }
    }
}

function createDocument(localeFeedback, localeDetected) {

    var stringsNotLoaded = '';
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                      'August', 'September', 'October', 'November', 'December'];
    var certResults = {
        Failed: 'Certification - FAILED',
        FailedWithRec: 'Certification - FAILED w/ Recommendation(s)',
        Passed: 'Certification - PASSED',
        PassedWithRec: 'Certification - PASSED w/ Recommendation(s)',
    };
    var docRecFeedback = {};
    const doc = new Document({
        styles: {
            paragraphStyles: [
                {
                    id: "Normal",
                    name: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Calibri",
                        size: 22,
                        bold: false,
                    },
                    paragraph: {
                        alignment: AlignmentType.LEFT,
                    },
                },
                {
                    id: "Title",
                    name: "Title",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Calibri Light",
                        size: 56,
                        bold: false,
                        color: "000000",
                    },
                },
                {
                    id: "Heading1",
                    name: "Heading 1",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Nirmala UI",
                        size: 20,
                        bold: false,
                    },
                    paragraph: {
                        spacing: { line: 340 },
                    },
                },
                {
                    id: "Heading2",
                    name: "Heading 2",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Calibri",
                        size: 32,
                        bold: false,
                        color: '2E74B5',
                    },
                    paragraph: {
                        spacing: { line: 276 },
                    },
                },
                {
                    id: "Heading3",
                    name: "Heading 3",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Calibri Light",
                        size: 26,
                        bold: false,
                    },
                    paragraph: {
                        alignment: AlignmentType.LEFT,
                    },
                },
            ],
        },
    });

    var today = new Date();
    var formattedDate = (today.getMonth()+1) + "" + today.getDate() + "" + today.getFullYear().toString().substr(-2);
    var skillTitle = document.getElementById('summary-val').innerText.split('|')[0].replace(' ', '');
    var skillId = document.getElementById('environment-val').innerText;
    var fileName = skillTitle + '_Feedback_' + formattedDate + '.docx';
    var alexaLogo = Media.addImage(doc, convertedUrl, 181, 26);

    if (localeDetected.en_all == true && !isNullOrWhitespace(localeFeedback.English)) {
        generateParagraph(localeFeedback, 'English', certResults, docRecFeedback);
    }
    if (localeDetected.en_all == true && isNullOrWhitespace(localeFeedback.English)) {
        stringsNotLoaded += 'en \(all\)<br/>';
    }
    if ((localeDetected.fr_fr == true || localeDetected.fr_ca == true) && !isNullOrWhitespace(localeFeedback.French)) {
        generateParagraph(localeFeedback, 'French', certResults, docRecFeedback);
    }
    if (!isNullOrWhitespace(localeFeedback.French)) {
        if (!localeFeedback.French.toLowerCase().includes('slutest')) {
            stringsNotLoaded += 'fr \(SLU\)<br/>';
        }
        if (localeDetected.fr_fr == true && !localeFeedback.French.toLowerCase().includes('fr_fr')) {
            stringsNotLoaded += 'fr_fr<br/>';
        }
        if (localeDetected.fr_ca == true && !localeFeedback.French.toLowerCase().includes('fr_ca')) {
            stringsNotLoaded += 'fr_ca<br/>';
        }
    }
    if (isNullOrWhitespace(localeFeedback.French)) {
        if (localeDetected.fr_fr == true) {
            stringsNotLoaded += 'fr_fr<br/>';
        }
        if (localeDetected.fr_ca == true) {
            stringsNotLoaded += 'fr_ca<br/>';
        }
    }
    if ((localeDetected.es_es == true || localeDetected.es_mx == true || localeDetected.es_us == true) && !isNullOrWhitespace(localeFeedback.Spanish)) {
        generateParagraph(localeFeedback, 'Spanish', certResults, docRecFeedback);
    }
    if (!isNullOrWhitespace(localeFeedback.Spanish)) {
        if (!localeFeedback.Spanish.toLowerCase().includes('slutest')) {
            stringsNotLoaded += 'es \(SLU\)<br/>';
        }
        if (localeDetected.es_es == true && !localeFeedback.Spanish.toLowerCase().includes('es_es')) {
            stringsNotLoaded += 'es_es<br/>';
        }
        if (localeDetected.es_mx == true && !localeFeedback.Spanish.toLowerCase().includes('es_mx')) {
            stringsNotLoaded += 'es_mx<br/>';
        }
        if (localeDetected.es_us == true &&!localeFeedback.Spanish.toLowerCase().includes('es_us')) {
            stringsNotLoaded += 'es_us<br/>';
        }
    }
    if (isNullOrWhitespace(localeFeedback.Spanish)) {
        if (localeDetected.es_es == true && (localeFeedback.Spanish.toLowerCase().includes('recommended') || localeFeedback.Spanish.toLowerCase().includes('failed'))) {
            stringsNotLoaded += 'es_es<br/>';
        }
        if (localeDetected.es_mx == true && (localeFeedback.Spanish.toLowerCase().includes('recommended') || localeFeedback.Spanish.toLowerCase().includes('failed'))) {
            stringsNotLoaded += 'es_mx<br/>';
        }
        if (localeDetected.es_us == true && (localeFeedback.Spanish.toLowerCase().includes('recommended') || localeFeedback.Spanish.toLowerCase().includes('failed'))) {
            stringsNotLoaded += 'es_us<br/>';
        }
    }
    if (localeDetected.de_de == true && !isNullOrWhitespace(localeFeedback.German)) {
        generateParagraph(localeFeedback, 'German', certResults, docRecFeedback);
    }
    if (localeDetected.de_de == true && isNullOrWhitespace(localeFeedback.German)) {
        stringsNotLoaded += 'German<br/>';
    }
    if (localeDetected.it_it == true && !isNullOrWhitespace(localeFeedback.Italian)) {
        generateParagraph(localeFeedback, 'Italian', certResults, docRecFeedback);
    }
    if (localeDetected.it_it == true && isNullOrWhitespace(localeFeedback.Italian)) {
        stringsNotLoaded += 'Italian<br/>';
    }
    if (localeDetected.ja_jp == true && !isNullOrWhitespace(localeFeedback.Japanese)) {
        generateParagraph(localeFeedback, 'Japanese', certResults, docRecFeedback);
    }
    if (localeDetected.ja_jp == true && isNullOrWhitespace(localeFeedback.Japanese)) {
        stringsNotLoaded += 'Japanese<br/>';
    }
    if (localeDetected.pt_br == true && !isNullOrWhitespace(localeFeedback.Portuguese)) {
        generateParagraph(localeFeedback, 'Portuguese', certResults, docRecFeedback);
    }
    if (localeDetected.pt_br == true && isNullOrWhitespace(localeFeedback.Portuguese)) {
        stringsNotLoaded += 'Portuguese<br/>';
    }
    if (localeDetected.hi_in == true && !isNullOrWhitespace(localeFeedback.Hindi)) {
        generateParagraph(localeFeedback, 'Hindi', certResults, docRecFeedback);
    }
    if (localeDetected.hi_in == true && isNullOrWhitespace(localeFeedback.Hindi)) {
        stringsNotLoaded += 'Hindi<br/>';
    }
    if (localeDetected.ar_sa == true && !isNullOrWhitespace(localeFeedback.Arabic)) {
        generateParagraph(localeFeedback, 'Arabic', certResults, docRecFeedback);
    }
    if (localeDetected.ar_sa == true && isNullOrWhitespace(localeFeedback.Arabic)) {
        stringsNotLoaded += 'Arabic<br/>';
    }

    doc.addSection({
        font: 'Calibri',
        headers: {
            default: new Header({
                children: [new Paragraph({children:[alexaLogo], alignment:AlignmentType.RIGHT,})],
            }),
        },
        children: [
            new Paragraph({
                text: skillTitle + ' Feedback',
                heading: HeadingLevel.TITLE,
            }),
            new Paragraph({
                children: [
                    new TextRun(skillId),
                    new TextRun(monthNames[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear()).break(),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun('CERTIFICATION SUMMARY').break(),
                ],
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
                children: [
                    certResults.English,
                    certResults.Spanish,
                    certResults.French,
                    certResults.German,
                    certResults.Italian,
                    certResults.Japanese,
                    certResults.Portuguese,
                    certResults.Hindi,
                    certResults.Arabic,
                ],
                heading: HeadingLevel.HEADING_3,
            }),
            docRecFeedback.English,
            docRecFeedback.Spanish,
            docRecFeedback.French,
            docRecFeedback.German,
            docRecFeedback.Italian,
            docRecFeedback.Japanese,
            docRecFeedback.Portuguese,
            docRecFeedback.Hindi,
            docRecFeedback.Arabic,
        ],
    });

    console.log(stringsNotLoaded);

    if (!isNullOrWhitespace(stringsNotLoaded)) {
        $("head").append (
            '<link '
            + 'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/ui-darkness/jquery-ui.min.css" '
            + 'rel="stylesheet" type="text/css">'
        );

        $("body").append ("<div id='tmOverlayDialog'><h2 style='color:white'>The following languages and locales were not detected to have any additional feedback:<br/><br/>" + stringsNotLoaded + "<br/>If there were any failures or recommended feedback that did not load properly, please make sure that the feedback left was formatted correctly following the guidelines listed here:<br/><br/>" + "<a style='color:darkturquoise' href='https://wiki.labcollab.net/confluence/pages/viewpage.action?spaceKey=COPS&title=JIRA+and+Feedback+Document+Formatting+-+Managed+Process+Best+Practices'>JIRA Comment Formatting</a></h2></div>");

        $("#tmOverlayDialog").dialog({
            modal:      true,
            title:      "AFG Results",
            position:   {
                my: "center",
                at: "top",
                of: document
                , collision: "none"
            },
            minWidth:   400,
            minHeight:  300,
            zIndex:     3666,
            open: function()
            {
                $(".ui-widget-overlay").click(function()
                                              {
                    $('#tmOverlayDialog').dialog('close');

                });
            }
        })
        .dialog ("widget").draggable ("option", "containment", "none");

    }

    Packer.toBlob(doc).then(blob => {
                        saveAs(blob, fileName);
    });
}