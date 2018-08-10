var db = {};
document.getElementById('enableCheckBox').addEventListener( 'change', function() {
    
    if(db['version']){

        if(this.checked) {
            db.enable = true;
        } else {
            db.enable = false;
        }
    
        var dbStr = JSON.stringify(db);
        chrome.storage.local.set({'db': dbStr}, function() {
            console.log('Saved');
        });
    }
    
});


chrome.storage.local.get(['db'], function(result) {
    if(result['db']){
        db = JSON.parse(result.db);
        if(db.enable){
            var elm = document.getElementById('enableCheckBox');
            if (checked == elm.checked) {
                elm.click();
            }
        }
    }
});