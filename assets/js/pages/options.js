// Data Storage Structure
var db = {
	'streamerName': 'Farzad',
	'streamerAccount': 'wikiweb_ir',
	'startSign': '!',
	'botName': '🤖✅',
	'enable': false,
	'commands': [
		{'command':'mouse','msg':'CoolerMaster 2019'}
	],
	'timers': [
		{'second':60,'msg':'Welcome'}
	]
};

var version = "V1.7";
var commandListCnt = 0;
var timerListCnt = 0;
var lastDb = '';
var streamerUsername='';

//Form Handler
chrome.storage.local.get(['isLogin'], function(result) {
	if(result['isLogin']){
        streamerUsername= result['isLogin'];
		$('.page').hide();
		$('#menuPage').show();
	}else{
        $('.page').hide();
        $('#loginPage').show();
	}
});



window.callAjax = function(url, options){

	if (url != null && url != '') {

		var requestType = (options.type) ? options.type : "get";
		var requestTimeOut = (options.timeout) ? options.timeout : 20000;
		var onError = (options.onError) ? options.onError : "defaultErrorHandle";
		var onSuccess = (options.onSuccess) ? options.onSuccess : null;
		var data = (options.data) ? options.data : null;

		$.ajax({
			url: url,
			dataType: 'JSON',
			type: requestType,
			data: data,
			timeout: requestTimeOut,
			success: function(apiData) {
				onSuccess(apiData,options);
			},
			error: function(error) {
				onError(error);
			}
		});
	}
};

// Version Controller
var getLastVersionOptions = {
	'onSuccess': function(result,options){
		try{
			if(result['name'] != version){
				$('#updateBox').show();
			}
		}catch(e){
			console.log(e);
		}
	},
	'onError': function(){
		console.log('error on get update version');
	}
};
callAjax('https://api.github.com/repos/wikiweb/aparat-chatbot/releases/latest',getLastVersionOptions);


//Spotify
document.getElementById('spotifyAuth').addEventListener('click',function (ev) {
	var w = window.open('http://localhost/spotify?auth&u='+streamerUsername);
	$(this).hide();
	$('#spotifyCheck').show();
});
document.getElementById('spotifyCheck').addEventListener('click',function (ev) {

});

window.startLoader = function () {
	setTimeout(function () {
		$('#pageLoading').show();
    },1)
};

window.endLoader = function () {
	$('#pageLoading').hide();
};

//LinkEvents
$('.pageLink').on('click',function () {
	var target= $(this).data('target_page');
	if(target=='adminForm'){
		adminFormHandler();
	}
	$('.page').hide();
	$('#'+target).show();
});