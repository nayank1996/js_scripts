// ==UserScript==
// @name         [Optimus]Risk finder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       nayankjh@
// @match        https://optimus-prod.aka.amazon.com/activityDetail/certMngr/*
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
              addTextBox('Provide the Test case');
       },7000);

    function addTextBox(text){
    var x = document.createElement("INPUT");
        x.setAttribute("type", "text");
        x.setAttribute("placeholder",text);
        x.setAttribute("style","font-size:16px; border-radius:10px;margin-left:20px")
      var par =document.querySelector("#app > section > main > div > div > div > div.workSpaceArea > div > div:nth-child(1) > div > div.ant-col.ant-col-16 > div");
        par.after(x)
       x.addEventListener("keypress", function(e){
           if(e.key === "Enter"){
               e.preventDefault()
               var y= x.value;
           window.open('https://rms-cops.aka.amazon.com/risks?keyword='+y)
           }
       })
    }
})();