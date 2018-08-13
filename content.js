var commandsStructure={};
var chatHistory = {};
var startSign = '!';
var streamerUsername = '';
var botName = '';
var enableFlag = false;
var aparatUserName = '';

chrome.storage.local.get(['db'], function(result) {
    if(result['db']){
        var db = JSON.parse(result.db);
        startSign = db.startSign;
        streamerUsername = db.streamerAccount.toLowerCase();
        botName = db.botName;
        enableFlag = db.enable;

        var tablink = window.location.href;
        var urlUserName = tablink.split('/');
        
        if(db.streamerAccount != aparatUserName){
            enableFlag= false;
        }
        
        if(enableFlag){
            
            db.commands.forEach(items => {
                commandsStructure[db.startSign + items.command.toLowerCase()] = items.msg;
            });


            db.timers.forEach(timeItems => {
                setInterval(function(){
                    document.getElementById('chat_input').value = botName + ': ' + timeItems['msg'];
                    document.getElementsByClassName('chat-submit')[0].click();
                },
                timeItems['second']*1000);
            });
        }

    }
});

var myTimer = setInterval(deviceReady, 1000);
var readyFlag = false;

function deviceReady(){

    
        var chatWrapper = document.getElementsByClassName('live-chat-wrapper')[0];
        if(chatWrapper){
            clearInterval(myTimer);

            var listEl = chatWrapper.getElementsByClassName('list')[0];
            listEl.addEventListener('DOMSubtreeModified',function(){
                var chat = $('.live-chat-wrapper .item p')[0].innerHTML.toLowerCase();
                
                if(enableFlag && (chat == startSign+'uptime' || commandsStructure[chat])){
                    
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
                                document.getElementById('chat_input').value = botName + ': ' + diffHrs + " ساعت و " + diffMins + " دقیقه";
                                document.getElementsByClassName('chat-submit')[0].click();
                            });
                        }else{
                            document.getElementById('chat_input').value = botName + ': ' +commandsStructure[chat];
                            document.getElementsByClassName('chat-submit')[0].click();
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
}

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