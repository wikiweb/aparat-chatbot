var commandsStructure={};
var chatHistory = {};
var startSign = '!';
var streamerUsername = '';
var botName = '';
var enableFlag = false;
var aparatUserName = '';
var isLogin=true;
var timerCommands=[];

chrome.storage.local.get(['isLogin'], function(result) {
    var tablink = window.location.href;
    var urlUserName = tablink.split('/');
    
    console.log('chatBot',urlUserName[3],result['isLogin']);
    if(urlUserName[3] != 'user'){
        if(urlUserName[3].toLowerCase() != result['isLogin'].toLowerCase()){
            isLogin= false;
        }
    }    
});

chrome.storage.local.get(['db'], function(result) {
    if(result['db']){
        var db = JSON.parse(result.db);
        startSign = db.startSign;
        streamerUsername = db.streamerAccount.toLowerCase();
        botName = db.botName;
        enableFlag = db.enable;
        timerCommands = db.timers;
        if(enableFlag){
            
            db.commands.forEach(items => {
                commandsStructure[db.startSign + items.command.toLowerCase()] = items.msg;
            });
        }

    }
});

var myTimer = setInterval(deviceReady, 1000);
var readyFlag = false;
var luser,ltoken,token,amIAdmin=false;
function deviceReady(){



    chrome.storage.local.get(['loginDb'], function (result) {
        if(result['loginDb']){
            var tablink = window.location.href;
            var urlUserName = tablink.split('/');

            luser = result['loginDb']['luser'];
            token = result['loginDb']['token'];

            var script = document.createElement("script");
            script.innerHTML = "var chatBotLUser='"+luser+"'; var chatBotToken='"+token+"'; var chatBotAmIAdmin=false;";
            document.head.appendChild(script);


            callAjax('https://meetso.ir/chatbot/?amIAdmin&luser='+result['loginDb']['luser']+'&token='+result['loginDb']['token']+'&username='+urlUserName[3], function (responseText) {
                if(responseText=='success'){
                    amIAdmin = true;
                    var script = document.createElement("script");
                    script.innerHTML = "var chatBotAmIAdmin=true;";
                    document.head.appendChild(script);
                }
            });
        }
    });










    if(isLogin && enableFlag){
        timerCommands.forEach(timeItems => {
            setInterval(function(){
                document.getElementsByClassName("chat-input")[0].value = botName + ': ' + timeItems['msg'];
                var event = document.createEvent("SVGEvents");
                event.initEvent("click",true,true);
                document.getElementsByClassName('send-button')[0].dispatchEvent(event);
            },
            timeItems['second']*1000);
        });
    }

        var chatWrapper = document.getElementsByClassName('chat')[0];
        if(chatWrapper){
            clearInterval(myTimer);
            var listEl = chatWrapper.getElementsByClassName('chat__content')[0];
            listEl.addEventListener('DOMSubtreeModified',function(){
                var chat = $('.chat__content .message .message__text').last()[0].innerHTML.toLowerCase();
                console.log(chat)
                if(isLogin && enableFlag && (chat == startSign+'uptime' || commandsStructure[chat])){
                    
                    var now = new Date();
                    var timeFlag = ((now.getTime() - chatHistory[chat]) / 1000) > 5;
                    
                    if(!chatHistory[chat] || timeFlag){

                        chatHistory[chat] = new Date();

                        if(chat == startSign+'uptime'){
                            
                            // document.getElementById('chat_input').value = ;
                            window.callAjax('https://api.aparat.com/fa/v2/live/live/get_stream/username/'+streamerUsername+'/deviceType/web',function(responseText){
                                console.log('ajax success');
                                var streamData = JSON.parse(responseText);
                                var streamStartDate = streamData['data']['attributes']['stat']['start_date'];
                                var startStreamDate = new Date(streamStartDate);

                                var today = new Date();
                                var diffMs = (today - startStreamDate); // milliseconds between now & Christmas
                                var diffDays = Math.floor(diffMs / 86400000); // days
                                var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
                                var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                                document.getElementsByClassName("chat-input")[0].value = botName + ': ' + diffHrs + " ساعت و " + diffMins + " دقیقه";
                                
                                var event = document.createEvent("SVGEvents");
                                event.initEvent("click",true,true);
                                document.getElementsByClassName('send-button')[0].dispatchEvent(event);
                            });
                        }else{
                            console.log(1111);
                            document.getElementsByClassName("chat-input")[0].value = botName + ': ' +commandsStructure[chat];
                            
                            var event = document.createEvent("SVGEvents");
                            event.initEvent("click",true,true);
                            document.getElementsByClassName('send-button')[0].dispatchEvent(event);
                        }
                        
                    }
                }
            });

        }
}


window.callAjax = function(url, callback){
    var xmlhttp;
    // compatible with IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            callback(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
};


if(window.localStorage['persistentStore']){
   try{
       var aparatData = JSON.parse(window.localStorage.persistentStore);
       if(aparatData['userStore']){
           aparatUserName = aparatData.userStore.username;
       }
   } catch(e){
       console.log(e);
   }
}

var script = document.createElement("script");
script.innerHTML = "window.chatBotBanUser = function() {\n" +
    "    if(chatBotAmIAdmin){ \n" +
    "    var username= prompt('enterUsername',''); \n" +
    "    var x = confirm('Are u sure to ban '+username+'?');\n" +
    "    if(x){\n" +
    "        var tablink = window.location.href;\n" +
    "        var urlUserName = tablink.split('/');\n" +
    "        chatBotCallAjax('https://meetso.ir/chatbot/?banUser&channel='+urlUserName[3]+'&username='+username+'&luser='+chatBotLUser+'&token='+chatBotToken,function (responseText) {\n" +
    "            if(responseText=='success'){\n" +
    "                alert('User Banned');\n" +
    "            }else{\n" +
    "                alert(\"Error\");\n" +
    "            }\n" +
    "        });\n" +
    "    } }else{  alert('this is for moderator !!!'); }\n" +
    "};" +
    "window.chatBotCallAjax = function(url, callback){\n" +
    "    var xmlhttp;\n" +
    "    xmlhttp = new XMLHttpRequest();\n" +
    "    xmlhttp.onreadystatechange = function(){\n" +
    "        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){\n" +
    "            callback(xmlhttp.responseText);\n" +
    "        }\n" +
    "    }\n" +
    "    xmlhttp.open('GET', url, true);\n" +
    "    xmlhttp.send();\n" +
    "};";
document.head.appendChild(script);


var banLink = document.createElement("a");
banLink.innerHTML = 'Ban User';
banLink.setAttribute('style','color:#fff;width:100px; height:40px;position:fixed;font-size:15px;top:30px;left:0px;z-index:99999999999;');
banLink.setAttribute('onclick','chatBotBanUser()');
document.body.appendChild(banLink);


