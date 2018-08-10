// Data Storage Structure
var db = {
	'streamerName': 'Farzad',
	'streamerAccount': 'wikiweb_ir',
	'startSign': '!',
	'version': '1.0',
	'botName': '🤖✅',
	'enable': false,
	'commands': [
		{'command':'mouse','msg':'CoolerMaster 2019'}
	],
	'timers': [
		{'second':60,'msg':'Welcome'}
	]
};

var commandListCnt = 0;
var timerListCnt = 0;
var lastDb = '';

// TODO: Storage Handler
chrome.storage.local.get(['db'], function(result) {
	if(result['db']){
		
		db = JSON.parse(result.db);
		lastDb = db;

		$('#streamerName').val(db.streamerName);
		$('#streamerAccount').val(db.streamerAccount);
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
});

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
	db.streamerAccount = $('#streamerAccount').val();
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