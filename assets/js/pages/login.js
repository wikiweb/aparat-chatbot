document.getElementById('loginForm').addEventListener('submit', function (evt) {
    evt.preventDefault();
    startLoader();

    var username = $('#loginUsername').val();
    var password = $('#loginPassword').val();

    callAjax('https://meetso.ir/chatbot/?login', {
        type: "POST",
        data:{
            'luser': username,
            'lpass': sha1(md5(password))
        },
        onSuccess: function (result, options) {
            endLoader();
            if(result['type']=='success'){

                chrome.storage.local.set({
                        'loginDb': {
                            'luser': result['luser'],
                            'ltoken': result['ltoken'],
                            'token': result['token']
                        }
                    }, function () {
                        console.log('login Result Set');
                    }
                );

                chrome.storage.local.set({'isLogin': result['luser']}, function () {
                    console.log('db set');
                });

                $('.page').hide();
                $('#menuPage').show();

            }else{
                alert(result['msg']);
            }
        },
        onError: function (error) {
            endLoader();
            alert('Error on login');
        }
    });

    return false;
});





//LOGOUT
$('.logoutForm').on('click',function () {
    logout();
});

function logout() {
    chrome.storage.local.set({'isLogin': ''}, function () {
        console.log('db set');
        $('.page').hide();
        $('#loginPage').show();
    });
}