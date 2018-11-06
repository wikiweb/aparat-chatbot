function adminFormHandler() {
    startLoader();

    $('#adminsList').html('');
    $('#adminHereList').html('');
    $('#bannedLog').html('');

    chrome.storage.local.get(['loginDb'], function (result) {
        if(result['loginDb']){
            callAjax('https://meetso.ir/chatbot/?getAdminList', {
                type: "POST",
                data: {
                    "luser": result['loginDb']['luser'],
                    "token": result['loginDb']['token']
                },
                onSuccess: function (result,options) {
                    if(result['data']){
                        for(var i in result['data']){
                            var username = result['data'][i]['username'];
                            var html = '<li id="adminListItem_S_' + username + '" class="list-group-item d-flex justify-content-between align-items-center">';
                            html += username;
                            html += '<a id="adminRemoveBtn_S_' + username + '" class="adminRemove badge badge-danger text-white badge-pill">Remove</a></ul>';
                            $('#adminsList').append(html);
                        }
                    }

                    if(result['channel_data']){
                        for(var i in result['channel_data']){
                            var html = '<a class="btn" href="https://www.aparat.com/'+result['channel_data'][i]['username']+'" target="_blank">'+result['channel_data'][i]['username']+'</a>';
                            $('#adminHereList').append(html);
                        }
                    }

                    endLoader();
                },
                onError: function (error) {
                    alert('Server Error');
                    endLoader();
                }
            });
        }else{
            logout();
        }
    });
}

document.getElementById('addAdminForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    startLoader();
    chrome.storage.local.get(['loginDb'], function (result) {
        var username = $('#adminUserName').val();
        $('#adminUserName').val('');

        if(result['loginDb']){
            callAjax('https://meetso.ir/chatbot/?addAdmin', {
                type: "POST",
                data: {
                    "luser": result['loginDb']['luser'],
                    "token": result['loginDb']['token'],
                    "username": username
                },
                onSuccess: function (result,options) {
                    if(result['type']=='success'){
                        var username = result['username'];
                        var html = '<li id="adminListItem_S_' + username + '" class="list-group-item d-flex justify-content-between align-items-center">';
                        html += username;
                        html += '<a id="adminRemoveBtn_S_' + username + '" class="adminRemove badge badge-danger text-white badge-pill">Remove</a></ul>';
                        $('#adminsList').append(html);
                    }
                    endLoader();
                },
                onError: function (error) {
                    alert('Server Error');
                    endLoader();
                }
            });
        }else{
            logout();
        }
    });
    return false;
});

$(document).on('click', '.adminRemove', function () {

    startLoader();
    var username = (this.id).split('_S_')[1];
    chrome.storage.local.get(['loginDb'], function (result) {

        if(result['loginDb']){
            callAjax('https://meetso.ir/chatbot/?deleteAdmin', {
                type: "POST",
                data: {
                    "luser": result['loginDb']['luser'],
                    "token": result['loginDb']['token'],
                    "username": username
                },
                onSuccess: function (result,options) {
                    if(result['type'] == 'success'){
                        var username = result['username'];
                        $('#adminListItem_S_' + username).remove();
                    }
                    endLoader();
                },
                onError: function (error) {
                    alert('Server Error');
                    endLoader();
                }
            });
        }else{
            logout();
        }
    });
});

$('.reloadAdminLogData').on('click',function () {
    startLoader();
    $('#bannedLog').html('');

    chrome.storage.local.get(['loginDb'], function (result) {
        if(result['loginDb']){
            callAjax('https://meetso.ir/chatbot/?getAdminLogs', {
                type: "POST",
                data: {
                    "luser": result['loginDb']['luser'],
                    "token": result['loginDb']['token']
                },
                onSuccess: function (result,options) {
                    if(result['type']=='success' && result['data']){
                        for(var i in result['data']){
                            var html = '<tr>\n' +
                                '<th>'+result['data'][i]['username']+'</th>\n' +
                                '<th>'+result['data'][i]['banned_username']+'</th>\n' +
                                '<th>'+result['data'][i]['sdate']+'</th>\n' +
                                '</tr>';
                            $('#bannedLog').append(html);
                        }
                    }
                    endLoader();
                },
                onError: function (error) {
                    alert('Server Error');
                    endLoader();
                }
            });
        }else{
            logout();
        }
    });
});