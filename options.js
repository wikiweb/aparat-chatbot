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

var version = "V1.2";
var commandListCnt = 0;
var timerListCnt = 0;
var lastDb = '';

// TODO: Storage Handler
chrome.storage.local.get(['db'], function(result) {
	if(result['db']){
		
		db = JSON.parse(result.db);
		lastDb = db;

		pageSetupHandler(db);


	}
});

function pageSetupHandler(db){
	$('#streamerName').val(db.streamerName);
		$('#streamerAccount').val(db.streamerAccount.toLowerCase());
		$('#startSign').val(db.startSign);
		$('#botName').val(db.botName);		
		
		var elmEnable = document.getElementById('enableCheckBox');
		if(db.enable){
			if (!elmEnable.checked) {
				elmEnable.click();
			}
		}else{
			if (elmEnable.checked) {
				elmEnable.click();
			}
		}
		

		if(db['commands'] && db['commands'].length>0){
			db.commands.forEach(item => {
				
				commandListCnt++;
				var html = '<tr class="commandListItem" id="cmdListItem_'+commandListCnt+'"><td>';
				html += '<input type="text" class="form-control form-cmd frmCmd" value="'+item.command+'" required>';
				html += '</td><td>';
				html +=	'<input type="text" class="form-control form-cmd frmMsg" value="'+item.msg+'" required>';
				html += '</td><td><a id="cmdListItemDelete_'+commandListCnt+'" data-id="'+commandListCnt+'" class="btn btn-danger text-white">-</a></td></tr>';
				
				$('#commandsList').append(html);
		
				document.getElementById('cmdListItemDelete_'+commandListCnt).addEventListener('click',deleteCommand);
			});
		}


		if(db['timers'] && db['timers'].length>0){
			db.timers.forEach(item => {
				
				timerListCnt++;
				var html = '<tr class="timerListItem" id="tmrListItem_'+timerListCnt+'"><td>';
				html += '<input type="text" class="form-control form-tmr frmSec" value="'+item.second+'" required>';
				html += '</td><td>';
				html +=	'<input type="text" class="form-control form-tmr frmMsg" value="'+item.msg+'" required>';
				html += '</td><td><a id="tmrListItemDelete_'+timerListCnt+'" data-id="'+timerListCnt+'" class="btn btn-danger text-white">-</a></td></tr>';
				
				$('#timersList').append(html);
		
				document.getElementById('tmrListItemDelete_'+timerListCnt).addEventListener('click',deleteTimer);
			});
		}
}

// Command Form Generator
document.getElementById('addCommandEl').addEventListener('click',addCommand);
function addCommand(){
	commandListCnt++;
		var html = '<tr class="commandListItem" id="cmdListItem_'+commandListCnt+'"><td>';
		html += '<input type="text" class="form-control form-cmd frmCmd"  required>';
		html += '</td><td>';
		html +=	'<input type="text" class="form-control form-cmd frmMsg" required>';
		html += '</td><td><a id="cmdListItemDelete_'+commandListCnt+'" data-id="'+commandListCnt+'" class="btn btn-danger text-white">-</a></td></tr>';
		$('#commandsList').append(html);
		document.getElementById('cmdListItemDelete_'+commandListCnt).addEventListener('click',deleteCommand);
}

function deleteCommand(){
	var cnfrm = confirm('Are You Sure?');
	if(cnfrm){
		var id = $(this).data('id');
		$('#cmdListItem_'+id).remove();
	}
}



// TODO: Timer Form Generator
document.getElementById('addTimerEl').addEventListener('click',addTimer);
function addTimer(){
	timerListCnt++;
		var html = '<tr class="timerListItem" id="tmrListItem_'+timerListCnt+'"><td>';
		html += '<input type="text" class="form-control form-tmr frmSec"  required>';
		html += '</td><td>';
		html +=	'<input type="text" class="form-control form-tmr frmMsg" required>';
		html += '</td><td><a id="tmrListItemDelete_'+timerListCnt+'" data-id="'+timerListCnt+'" class="btn btn-danger text-white">-</a></td></tr>';
		$('#timersList').append(html);
		document.getElementById('tmrListItemDelete_'+timerListCnt).addEventListener('click',deleteTimer);
}

function deleteTimer(){
	var cnfrm = confirm('Are You Sure?');
	if(cnfrm){
		var id = $(this).data('id');
		$('#tmrListItem_'+id).remove();
	}
}

document.getElementById('exportForm').addEventListener("click",function(){
	var c = confirm('You Should save Form Before export');
	if(c){
		var txt = JSON.stringify(db);
		download('export.txt',txt);		
	}
});


document.getElementById('importForm').addEventListener("click",function(){
	var pom = document.createElement('input');
	pom.type='file';
	pom.id="importFile";
	pom.click();
	pom.addEventListener('change',function(evt){
		evt.stopPropagation();
		evt.preventDefault();
		
		var reader = new FileReader();
		if (pom.files.length) {
			var textFile = pom.files[0];
			reader.readAsText(textFile);
			$(reader).on('load', processFile);
		} else {
			alert('Please upload a file before continuing')
		} 

	});

});

function processFile(e){
	var file = e.target.result,
        results;
    if (file && file.length) {        
		var newDb = JSON.parse(file);
		if(newDb['streamerAccount']){
			chrome.storage.local.set({'db': file}, function() {
				alert('Success');
				pageSetupHandler(newDb);
			});
		}
    }
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

document.getElementById("saveForm").addEventListener("click",saveForm);
function saveForm(){
	var commands = [];
	$('#commandsList tr').each(function( index ) {
		
		var command= $(this).find('.frmCmd').val();
		var message= $(this).find('.frmMsg').val();
		if(command && message){
			commands.push({
				'command':command,
				'msg':message
			});
		}
	});
	db.commands=commands;

	var timers = [];
	$('#timersList tr').each(function( index ) {
		
		var second= $(this).find('.frmSec').val();
		var message= $(this).find('.frmMsg').val();
		if(second && message){
			timers.push({
				'second':second,
				'msg':message
			});
		}
	});
	db.timers=timers;

	var elmEnable = document.getElementById('enableCheckBox');
	db.enable = (elmEnable.checked)? true:false;

	db.streamerName = $('#streamerName').val();
	db.streamerAccount = $('#streamerAccount').val().toLowerCase();
	db.startSign = $('#startSign').val();
	db.botName = $('#botName').val();

	var dbStr = JSON.stringify(db);
	lastDb = dbStr;

	chrome.storage.local.set({'db': dbStr}, function() {
		alert('Success');
	});
	
}


window.addEventListener("beforeunload", function (e) {
	if (JSON.stringify(db) == lastDb) {
		return undefined;
	}

	var confirmationMessage = 'It looks like you have been editing something. '
							+ 'If you leave before saving, your changes will be lost.';

	(e || window.event).returnValue = confirmationMessage; //Gecko + IE
	return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
});

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


callAjax('https://api.github.com/repos/wikiweb/aparat-chatbot/releases/latest',function(result){
	try{
		var result = JSON.parse(result);
		console.log(result['name'],version);
		if(result['name'] != version){
			$('#updateBox').show();
		}
	}catch(e){
		console.log(e);
	}
	
})