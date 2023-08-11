// ==UserScript==
// @name         [Optimus] Category badge
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  get the category of the skill as a badge
// @author       nayankjh@
// @match        https://optimus-prod.aka.amazon.com/skill/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==
var $ = window.jQuery;
(function() {
    var main = {'CHILDRENS_AMBIENT_SOUNDS':'Kids - Music & Audio - Ambient Sounds','CHILDRENS_ARTS_AND_CULTURE':'Kids - Education & Reference - Arts & Culture','PARTY_GAMES':'Games & Trivia - Games - Party Games','ALARMS_AND_CLOCKS':'Utilities - Alarms & Clocks', 'ASTROLOGY':'Lifestyle - Astrology', 'BUSINESS_AND_FINANCE':'Business & Finance', 'CALCULATORS':'Utilities - Calculators', 'CALENDARS_AND_REMINDERS':'Utilities - Calendars & Reminders', 'CARD_GAMES':'Games & Trivia - Games - Card Games', 'CHILDRENS_CREATIVITY':'Kids - Education & Reference - Creativity', 'CHILDRENS_EDUCATION_AND_REFERENCE':'Kids - Education & Reference', 'CHILDRENS_FOREIGN_LANGUAGE':'Kids - Education & Reference - Foreign Languages', 'CHILDRENS_GAMES':'Kids - Games', 'CHILDRENS_LIFE_SKILLS':'Kids - Health & Wellness - Life Skills', 'CHILDRENS_MATH':'Kids - Education & Reference - Math', 'CHILDRENS_MEDITATION_AND_MINDFULNESS':'Kids - Health & Wellness - Meditation & Mindfulness', 'CHILDRENS_MOVIE_AND_TV_GAMES':'Kids - Games - Movie & TV games', 'CHILDRENS_MUSIC':'Kids - Music & Audio - Music', 'CHILDRENS_MUSIC_AND_AUDIO':'Kids - Music & Audio', 'CHILDRENS_NATURE_AND_ANIMAL':'Kids - Education & Reference - Nature & Animals', 'CHILDRENS_NOVELTY_AND_HUMOR':'Kids - Novelty & Humor', 'CHILDRENS_RADIO':'Kids - Music & Audio - Radio', 'CHILDRENS_SPEECH':'Kids - Education & Reference - Speech', 'CHILDRENS_WORD_AND_CATEGORIZATION_GAMES':'Kids - Games - Words & Categorization Games', 'CHOOSE_YOUR_OWN_STORY':'Games & Trivia - Games - Choose Your Own Story Games', 'COMMUNICATION':'Social - Communication', 'CONNECTED_CAR':'Connected Car', 'COOKING_AND_RECIPE':'Food & Drink - Cooking & Recipes', 'DATING':'Social - Dating', 'DELIVERY_AND_TAKEOUT':'Food & Drink - Delivery & Takeout', 'DEVICE_TRACKING':'Utilities - Device Tracking', 'EARLY_LEARNING':'Kids - Education & Reference - Early Learning', 'EDUCATIONAL_GAMES':'Games & Trivia - Games - Educational Games', 'EDUCATION_AND_REFERENCE':'Education & Reference', 'EVENT_FINDERS':'Lifestyle - Event Finders', 'EXERCISE_AND_WORKOUT':'Sports - Exercise & Workout', 'FASHION_AND_STYLE':'Lifestyle - Fashion & Style', 'FLIGHT_FINDERS':'Travel & Transportation - Flight Finders', 'FRIENDS_AND_FAMILY':'Social - Friends & Family', 'GAMES':'Games & Trivia - Games', 'GAME_INFO_AND_ACCESSORY':'Games & Trivia - Game Info & Accesories', 'GAME_SHOW_GAMES':'Games & Trivia - Games - Game Show Games', 'HEALTH_AND_FITNESS':'Health & Fitness', 'HOME_SERVICES':'Lifestyle - Home Services', 'HOTEL_FINDERS':'Travel & Transportation - Hotel Finders', 'KNOWLEDGE_AND_TRIVIA':'Games & Trivia - Knowledge & Trivia', 'MEMORY_GAMES':'Games & Trivia - Games - Memory Games', 'MOVIE_AND_TV_GAMES':'Games & Trivia - Games - Movie & TV Games', 'MOVIE_AND_TV_KNOWLEDGE_AND_TRIVIA':'Movies & TV - Knowledge & Trivia', 'MOVIE_INFO_AND_REVIEWS':'Movies & TV - Movie Info & Reviews', 'MUSIC_AND_AUDIO_ACCESSORIES':'Music & Audio - Accessories', 'MUSIC_AND_AUDIO_KNOWLEDGE_AND_TRIVIA':'Music & Audio - Knowledge & Trivia', 'MUSIC_GAMES':'Games & Trivia - Games - Music Games', 'MUSIC_INFO_REVIEWS_AND_RECOGNITION_SERVICE':'Music & Audio - Music Info, Reviews & Recognition service', 'NAVIGATION_AND_TRIP_PLANNER':'Travel & Transportation - Navigation & Trip Planners', 'NEWS':'News', 'NOVELTY':'Novelty & Humor', 'NOVELTY_&_HUMOR_GAMES':'Games & Trivia - Games - Novelty & Humor Games', 'ORGANIZERS_AND_ASSISTANTS':'Productivity - Organizers & Assistants', 'PETS_AND_ANIMAL':'Lifestyle - Pets & Animals', 'PODCAST':'Music & Audio - Podcasts', 'PUBLIC_TRANSPORTATION':'Travel & Transportation - Public Transportation', 'QUIZZES':'Games & Trivia - Games - Quiz Games', 'RELIGION_AND_SPIRITUALITY':'Lifestyle - Religion & Spirituality', 'RESTAURANT_BOOKING_INFO_AND_REVIEW':'Food & Drink - Restaurant Booking, Info & Reviews', 'ROLE_PLAYING_GAMES':'Games & Trivia - Games - Role Playing Games', 'SCHOOLS':'Local - Schools', 'SCORE_KEEPING':'Sports - Score Keeping', 'SELF_IMPROVEMENT':'Lifestyle - Self Improvement', 'SHOPPING':'Shopping', 'SMART_HOME':'Smart Home', 'SOCIAL_NETWORKING':'Social - Social Networking', 'SPORTS_GAMES':'Sports - Games', 'SPORTS_NEWS':'Sports - News', 'STRATEGY_GAMES':'Games & Trivia - Games - Strategy Games', 'TABLETOP_GAMES':'Games & Trivia - Games - Tabletop Games', 'TO_DO_LISTS_AND_NOTES':'Productivity - To-Do Lists & Notes', 'TRANSLATORS':'Travel & Transportation - Translators', 'TV_GUIDES':'Movies & TV - TV Guides', 'WEATHER':'Weather', 'WINE_AND_BEVERAGE':'Food & Drink - Wine & Beverages', 'ZIP_CODE_LOOKUP':'Utilities - Zip Code Lookup', 'TAXI_AND_RIDESHARING':'Travel & Transportation - Taxi & Ridesharing', 'STREAMING_SERVICE':'Music & Audio - Streaming Services'}
   console.log(Object.keys(main))
    'use strict';
    setTimeout(function(){
        let url = window.location.href.split('/');
       let skillId = url[4];
        let version = url[6];
        let url1 = "https://alexaskillcontent-ca-iad.iad.proxy.amazon.com/api/cops-manifests/certification/" +skillId+"?version="+version;
    $.get(url1, function(data){
          // console.log(data);
        var paidData = data.skillManifest.skillManifestFeatures.publishingInformation.category;
       if(Object.keys(main).includes(paidData)){
       var indx =Object.keys(main).indexOf(paidData);
         paidData = Object.values(main)[indx];
       }
        var child = $("<span>").css({"margin-right": "0.5rem","font-size" : "14px","line-height": "1.5","padding": "0.1rem 0.8rem","border": "1px solid transparent","border-radius": "1.4rem","border-color": "rgb(0, 130, 150)"});
        child.html('Category-'+paidData);
        var parent = $("#app > section > main > div > div > div > div.skillInfo > div > div.ant-col.ant-col-22 > div.m-t-sm > div:nth-child(2) > div:nth-child(2)")
        parent.after(child);
        });
    },7000);
})();