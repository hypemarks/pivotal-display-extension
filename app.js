if(!PV){
    PV = {};
}
function initializeConstants(){
    var deferred = $.Deferred();
    chrome.storage.sync.get(null, function(data) {
        PV.members = data.members;
        PV.pivotal_token = data.pivotal_token;
        PV.project_id = data.project_id;
        deferred.resolve();
    });
    return deferred;
}

$(document).ready(function(){
    $.when(initializeConstants()).done(function(){
        if(!PV.pivotal_token || !PV.project_id){
            var initializationModal = new PV.InitializationModalView();
            initializationModal.render();
            initializationModal.$('.modal').on('hidden.bs.modal', function(){
                initializeConstants();
            });
        } else{
            console.log('render pivotal stuff');
        }
    });
});